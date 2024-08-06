<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\BusinessUnit;
use App\Models\Department;
use App\Models\Designation;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run()
    {
        $businessUnits = BusinessUnit::all();
        $departments = Department::all();
        $designations = Designation::all();

        $employees = [
            ['id' => 'EMP001', 'name' => 'John Doe'],
            ['id' => 'EMP002', 'name' => 'Jane Smith'],
            ['id' => 'EMP003', 'name' => 'Bob Johnson'],
            ['id' => 'EMP004', 'name' => 'Alice Brown'],
            ['id' => 'EMP005', 'name' => 'Charlie Davis'],
            ['id' => 'EMP006', 'name' => 'Eva Wilson'],
            ['id' => 'EMP007', 'name' => 'Frank Miller'],
            ['id' => 'EMP008', 'name' => 'Grace Lee'],
            ['id' => 'EMP009', 'name' => 'Henry Taylor'],
            ['id' => 'EMP010', 'name' => 'Ivy Chen'],
        ];

        foreach ($employees as $employeeData) {
            $employee = Employee::create([
                'id' => $employeeData['id'],
                'name' => $employeeData['name'],
                'business_unit_id' => $businessUnits->random()->id,
                'department_id' => $departments->random()->id,
                'designation_id' => $designations->random()->id,
            ]);

            $this->createAttendanceRecords($employee);
        }
    }
    private function createAttendanceRecords($employee)
    {
        $statuses = ['present', 'absent', 'holiday', 'tardy', 'onLeave', 'dayOff'];
        $startDate = Carbon::now()->subMonths(3)->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $status = $date->isWeekend() ? 'dayOff' : $statuses[array_rand($statuses)];
            
            $clockIn = null;
            $clockOut = null;
            $overTime = 0;
            $worked = 0;
            $expected = 480; // 8 hours in minutes
            $variance = 0;

            if ($status == 'present' || $status == 'tardy') {
                $clockIn = $date->copy()->setHour(8)->setMinute(rand(0, 59))->setSecond(rand(0, 59));
                if ($status == 'tardy') {
                    $clockIn->addHours(rand(1, 2));
                }
                $clockOut = $clockIn->copy()->addHours(8)->addMinutes(rand(0, 120));
                
                $worked = $clockOut->diffInMinutes($clockIn);
                $overTime = max(0, $worked - $expected);
                $variance = $worked - $expected;
            }

            Attendance::create([
                'employee_id' => $employee->id,
                'employee_name' => $employee->name,
                'date' => $date->format('Y-m-d'),
                'status' => $status,
                'clock_in' => $clockIn ? $clockIn->format('H:i:s') : null,
                'clock_out' => $clockOut ? $clockOut->format('H:i:s') : null,
                'over_time' => $overTime,
                'worked' => $worked,
                'expected' => $expected,
                'variance' => $variance,
            ]);
        }
    }
}