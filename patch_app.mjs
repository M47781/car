import fs from 'fs';

const p = 'src/App.tsx';
let src = fs.readFileSync(p, 'utf-8');

// Replace localStorage Load & Save effects with Supabase
const effectsOld = `
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('luxury_rental_planner_v2'); // new key for new schema
      if (saved) {
        setReservations(JSON.parse(saved));
      }
      
      const savedColors = localStorage.getItem('luxury_rental_client_colors_v2');
      if (savedColors) {
        setClientColors(JSON.parse(savedColors));
      }

      const savedCustomVehicles = localStorage.getItem('luxury_rental_custom_vehicles_v2');
      if (savedCustomVehicles) {
        setCustomVehicles(JSON.parse(savedCustomVehicles));
      }

      const savedDeletedVehicles = localStorage.getItem('luxury_rental_deleted_vehicles_v2');
      if (savedDeletedVehicles) {
        setDeletedVehicles(JSON.parse(savedDeletedVehicles));
      }
    } catch (e) {
      console.error("Could not load stored data", e);
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem('luxury_rental_planner_v2', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('luxury_rental_client_colors_v2', JSON.stringify(clientColors));
  }, [clientColors]);

  useEffect(() => {
    localStorage.setItem('luxury_rental_custom_vehicles_v2', JSON.stringify(customVehicles));
  }, [customVehicles]);

  useEffect(() => {
    localStorage.setItem('luxury_rental_deleted_vehicles_v2', JSON.stringify(deletedVehicles));
  }, [deletedVehicles]);
`;

const effectsNew = `
  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsAuthenticated(!!session);
      setSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsAuthenticated(!!session);
      setSessionLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Data Loading
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      const { data: settings } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single();
      if (settings) {
        if (settings.custom_vehicles) setCustomVehicles(settings.custom_vehicles);
        if (settings.deleted_vehicles) setDeletedVehicles(settings.deleted_vehicles);
        if (settings.client_colors) setClientColors(settings.client_colors);
      }

      const { data: resData } = await supabase.from('reservations').select('*').eq('user_id', user.id);
      if (resData) {
        const newPlanner: PlannerState = {};
        resData.forEach(r => {
          const key = \`\${r.date}_\${r.vehicle}\`;
          newPlanner[key] = {
            nom: r.nom || '',
            telephone: r.telephone || '',
            versement: (r.versement as 'oui' | 'non') || 'non',
            montant: r.montant || '',
            apporteur: r.apporteur || '',
            color: r.color || undefined,
            clientId: r.client_id || undefined
          };
        });
        setReservations(newPlanner);
      }
    };
    
    loadData();
  }, [user]);

  // Real-time
  useEffect(() => {
    if (!user) return;
    const channelRes = supabase.channel('schema-res-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations', filter: \`user_id=eq.\${user.id}\` }, (payload: any) => {
        if (payload.eventType === 'DELETE') {
          const old = payload.old;
          if (old && old.date && old.vehicle) {
            const key = \`\${old.date}_\${old.vehicle}\`;
            setReservations(prev => { const copy = { ...prev }; delete copy[key]; return copy; });
          }
        } else {
          const r = payload.new;
          if (r && r.date && r.vehicle) {
            const key = \`\${r.date}_\${r.vehicle}\`;
            setReservations(prev => ({
              ...prev, [key]: {
                nom: r.nom || '', telephone: r.telephone || '', versement: (r.versement as 'oui'|'non') || 'non', montant: r.montant || '', apporteur: r.apporteur || '', color: r.color || undefined, clientId: r.client_id || undefined
              }
            }));
          }
        }
      }).subscribe();
      
    const channelSet = supabase.channel('schema-set-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_settings', filter: \`user_id=eq.\${user.id}\` }, (payload: any) => {
         const settings = payload.new;
         if (settings) {
            if (settings.custom_vehicles) setCustomVehicles(settings.custom_vehicles);
            if (settings.deleted_vehicles) setDeletedVehicles(settings.deleted_vehicles);
            if (settings.client_colors) setClientColors(settings.client_colors);
         }
      }).subscribe();
      
    return () => { supabase.removeChannel(channelRes); supabase.removeChannel(channelSet); };
  }, [user]);

  const saveSettingsToSupabase = async (newColors: any, newCustom: any, newDeleted: any) => {
    if (!user) return;
    await supabase.from('user_settings').upsert({
      user_id: user.id,
      client_colors: newColors,
      custom_vehicles: newCustom,
      deleted_vehicles: newDeleted
    });
  };
`;
src = src.replace(effectsOld.trim(), effectsNew.trim());

// Update save logic
const handleSaveRegex = /const handleSave = \(\) => {[\s\S]*?showToast\(isUpdate \? "Réservation mise à jour avec succès" : "Nouvelle réservation ajoutée", "success"\);\n  };/;
const handleSaveNew = `const handleSave = async () => {
    if (editingKeys.length === 0 || !user) return;
    
    const firstKey = editingKeys[0];
    const existingRes = reservations[firstKey];
    const isUpdate = !!existingRes;
    
    let finalColor: string | undefined;
    let finalClientId: string | undefined;

    if (isUpdate) {
      finalColor = existingRes.color;
      finalClientId = existingRes.clientId;
    } else {
      const tel = telephone.trim();
      const name = nom.trim().toLowerCase();
      finalClientId = tel ? tel : name;
      finalColor = finalClientId ? clientColors[finalClientId] : undefined;
      
      if (finalClientId && !finalColor) {
        const hue = Math.floor(Math.random() * 360);
        finalColor = \`hsl(\${hue}, 70%, 45%)\`;
        const newColors = { ...clientColors, [finalClientId!]: finalColor! };
        setClientColors(newColors);
        saveSettingsToSupabase(newColors, customVehicles, deletedVehicles);
      }
    }
    
    const inserts = editingKeys.map(key => {
      const dateStr = key.substring(0, 10);
      const vehicle = key.substring(11);
      return {
        user_id: user.id,
        date: dateStr,
        vehicle: vehicle,
        nom,
        telephone,
        versement,
        montant: versement === 'oui' ? montant : '',
        color: finalColor,
        client_id: finalClientId,
        apporteur: apporteur.trim()
      };
    });
    
    await supabase.from('reservations').upsert(inserts, { onConflict: 'user_id, date, vehicle' });
    closeModal();
    showToast(isUpdate ? "Réservation mise à jour avec succès" : "Nouvelle réservation ajoutée", "success");
  };`;
src = src.replace(handleSaveRegex, handleSaveNew);

const handleDeleteRegex = /const handleDelete = \(\) => {[\s\S]*?showToast\("Réservation annulée", "info"\);\n  };/;
const handleDeleteNew = `const handleDelete = async () => {
    if (editingKeys.length === 0 || !user) return;
    
    for (const key of editingKeys) {
      const dateStr = key.substring(0, 10);
      const vehicle = key.substring(11);
      await supabase.from('reservations').delete().match({ user_id: user.id, date: dateStr, vehicle: vehicle });
    }
    closeModal();
    showToast("Réservation annulée", "info");
  };`;
src = src.replace(handleDeleteRegex, handleDeleteNew);

const handleDeleteDirectRegex = /const handleDeleteDirect = \(day: Date, vehicleId: string\) => {[\s\S]*?showToast\("Réservation annulée", "info"\);\n  };/;
const handleDeleteDirectNew = `const handleDeleteDirect = async (day: Date, vehicleId: string) => {
    if (!user) return;
    const dateStr = format(day, 'yyyy-MM-dd');
    await supabase.from('reservations').delete().match({ user_id: user.id, date: dateStr, vehicle: vehicleId });
    showToast("Réservation annulée", "info");
  };`;
src = src.replace(handleDeleteDirectRegex, handleDeleteDirectNew);

const handleAddVehicleRegex = /const handleAddVehicle = \(\) => {[\s\S]*?setNewVehicleName\(''\);\n  };\n/;
const handleAddVehicleNew = `const handleAddVehicle = () => {
    if (!user) return;
    const name = newVehicleName.trim().toUpperCase();
    if (name && !allVehicles.includes(name)) {
      const currentCustom = [...customVehicles, name];
      setCustomVehicles(currentCustom);
      let currentDeleted = deletedVehicles;
      if (deletedVehicles.includes(name)) {
        currentDeleted = currentDeleted.filter(v => v !== name);
        setDeletedVehicles(currentDeleted);
      }
      saveSettingsToSupabase(clientColors, currentCustom, currentDeleted);
    }
    setNewVehicleModalOpen(false);
    setNewVehicleName('');
  };\n`;
src = src.replace(handleAddVehicleRegex, handleAddVehicleNew);

const handleConfirmDeleteVehicleRegex = /const handleConfirmDeleteVehicle = \(\) => {[\s\S]*?setVehicleToDelete\(null\);\n  };/;
const handleConfirmDeleteVehicleNew = `const handleConfirmDeleteVehicle = async () => {
    if (!vehicleToDelete || !user) return;
    
    const currentDeleted = deletedVehicles.includes(vehicleToDelete) ? deletedVehicles : [...deletedVehicles, vehicleToDelete];
    if (!deletedVehicles.includes(vehicleToDelete)) {
      setDeletedVehicles(currentDeleted);
      saveSettingsToSupabase(clientColors, customVehicles, currentDeleted);
    }
    
    await supabase.from('reservations').delete().match({ user_id: user.id, vehicle: vehicleToDelete });
    setVehicleToDelete(null);
  };`;
src = src.replace(handleConfirmDeleteVehicleRegex, handleConfirmDeleteVehicleNew);

src = src.replace('if (!isAuthenticated) {', 'if (sessionLoading) return <div className="h-screen flex items-center justify-center bg-black text-white">Chargement...</div>;\n\n  if (!isAuthenticated || !user) {');
src = src.replace(/localStorage\.removeItem\('luxury_rental_auth'\);\s*setIsAuthenticated\(false\);/, 'await supabase.auth.signOut();');

fs.writeFileSync(p, src);
console.log('App.tsx patched successfully');
