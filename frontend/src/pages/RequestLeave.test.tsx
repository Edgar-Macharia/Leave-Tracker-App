import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import RequestLeave from './RequestLeave';
import userEvent from '@testing-library/user-event';
import React from 'react';
import AuthProvider from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import LeaveProvider from '../context/LeaveContext';
import "@testing-library/jest-dom/vitest";
import { useAuth } from '../context/AuthContext';


describe('calculateTotalDays', () => {
  vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
      currentUser: { leaveBalance: 10 }
    })
  }));


  it('shows error message when endDate is before startDate', () => {
    render(<Router><PrimeReactProvider><LeaveProvider><RequestLeave /></LeaveProvider></PrimeReactProvider></Router>);

    fireEvent.change(screen.getByTestId('startDateInput'), { target: { value: '2024-06-01' } });
    fireEvent.change(screen.getByTestId('endDateInput'), { target: { value: '2024-05-30' } });

    expect(screen.getByTestId('date-error').textContent).toBe('End date must be the same or after the start date.');
    expect(screen.queryByTestId('total-days')).not.toBeInTheDocument()
  });

  it('calculates total days correctly when endDate is after startDate and within leave balance', () => {



    render(<Router><PrimeReactProvider>
      <LeaveProvider><RequestLeave /></LeaveProvider></PrimeReactProvider></Router>);

    fireEvent.change(screen.getByTestId('startDateInput'), { target: { value: '2024-06-01' } });
    fireEvent.change(screen.getByTestId('endDateInput'), { target: { value: '2024-06-05' } });


    expect((screen.getByTestId('total-days').textContent)).toBe('Total days: 5');
    expect(screen.getByTestId('balance-error').textContent).toBe('')
    expect(screen.queryByTestId('date-error')).not.toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });

  it('disables submit and shows balance error when days requested exceed leave balance', () => {
    render(<Router><PrimeReactProvider><LeaveProvider><RequestLeave /></LeaveProvider></PrimeReactProvider></Router>);
    screen.debug();

    const startDateInput = screen.getByTestId('startDateInput');
    const endDateInput = screen.getByTestId('endDateInput');

    console.log('Start Date Input:', startDateInput);
    console.log('End Date Input:', endDateInput);

    fireEvent.change(startDateInput, { target: { value: '2024-05-30' } });
    fireEvent.change(endDateInput, { target: { value: '2024-06-10' } });

    screen.debug();



    expect(screen.getByTestId('leaveBalance').textContent).toBe("10")
    expect(screen.getByTestId('total-days').textContent).toBe('Total days: 12');
    expect(screen.getByTestId('balance-error').textContent).toBe('Number of days requested exceeds current balance');
    expect(screen.queryByTestId('date-error')).not.toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });
});

