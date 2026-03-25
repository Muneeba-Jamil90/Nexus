import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { supabase } from '../documents/lib/supabaseClient'; 
import { useAuth } from '../../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);

  const fetchMeeting = async () => {
    if (!user?.id) return;
    
    // Meetings Fetch
    const { data, error } = await supabase
      .from('meeting')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (error) console.error('Error:', error);
    else if (data) {
      const formatted = data.map((m: any) => ({
        id: m.id,
        title: m.status === 'confirmed' ? '✅ Confirmed' : m.status === 'declined' ? '❌ Declined' : '⏳ Pending',
        start: m.start_time,
        backgroundColor: m.status === 'confirmed' ? '#10b981' : m.status === 'declined' ? '#ef4444' : '#f59e0b',
        extendedProps: { status: m.status }
      }));
      setEvents(formatted);
    }
  };

  useEffect(() => { fetchMeeting(); }, [user]);

  // Handle Date Click with Availability Check
  const handleDateClick = async (info: any) => {
    if (!user) return;

    // 1. Availability Check
    const { data: availability, error: avError } = await supabase
      .from('availability')
      .select('*')
      .eq('available_date', info.dateStr);

    if (avError || !availability || availability.length === 0) {
      alert("Selected date is not available for meetings.");
      return;
    }

    // 2. Insert Meeting
    if (window.confirm(`Request meeting on ${info.dateStr}?`)) {
      const { error } = await supabase.from('meeting').insert([{ 
        sender_id: user.id, 
        receiver_id: "5e15af51-8985-4c86-ad6e-e32fc562e384", 
        start_time: info.dateStr, 
        status: 'pending' 
      }]);
      if (error) alert("Error: " + error.message);
      else fetchMeeting();
    }
  };

  const handleEventClick = async (info: any) => {
    const action = window.confirm("Click OK to Confirm, Cancel to Decline.");
    const { error } = await supabase
      .from('meeting')
      .update({ status: action ? 'confirmed' : 'declined' })
      .eq('id', info.event.id);

    if (error) alert("Error: " + error.message);
    else fetchMeeting();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Meeting Schedule</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
};