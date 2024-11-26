import React, { useEffect, useState } from 'react';
import { EventInput } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLeave } from '../context/LeaveContext';

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const { getAllLeavesForUser } = useLeave();
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    const fetchApprovedLeaves = async () => {
      try {
        const data = await getAllLeavesForUser();
        const approvedLeaves = data.filter((leave) => leave.status === 'Approved');

        const formattedEvents: EventInput[] = approvedLeaves.map((leave) => {
          // Convert startDate to ISO string
          const [startDay, startMonth, startYear] = leave.startDate.split('/').map(Number);
          const isoStartDate = `${startYear}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;

          // Convert endDate to ISO string
          const [endDay, endMonth, endYear] = leave.endDate.split('/').map(Number);
        
          const isoEndDate = `${endYear}-${endMonth.toString().padStart(2, '0')}-${ (endDay + 1).toString().padStart(2, '0')}`;

          return {
            title: leave.leaveType,
            start: isoStartDate,
            end: isoEndDate,
          };
        });

        console.log({ formattedEvents });
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching approved leaves:', error);
      }
    };

    fetchApprovedLeaves();
  }, [getAllLeavesForUser]);

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        eventClick={(info) => info.jsEvent.preventDefault()}
      />
    </div>
  );
};

export default Calendar;
