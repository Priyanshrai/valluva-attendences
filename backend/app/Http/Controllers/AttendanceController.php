<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\BusinessUnit;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Http\Request;
use Carbon\Carbon;
use League\Csv\Writer;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = $this->buildQuery($request);
        $attendances = $query->get();

        $groupedAttendances = $this->groupAttendances($attendances);

        return response()->json($groupedAttendances->isEmpty() ? [] : $groupedAttendances);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string',
            'employee_name' => 'required|string',
            'date' => 'required|date',
            'status' => 'required|string',
        ]);

        $attendance = Attendance::create($validated);
        return response()->json($attendance, 201);
    }

    public function show($id)
    {
        $attendance = Attendance::findOrFail($id);
        return response()->json($attendance);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);
        
        $validated = $request->validate([
            'employee_id' => 'sometimes|required|string',
            'employee_name' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'status' => 'sometimes|required|string',
        ]);

        $attendance->update($validated);
        return response()->json($attendance, 200);
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();
        return response()->json(null, 204);
    }

    public function download(Request $request)
    {
        $query = $this->buildQuery($request);
        $attendances = $query->get();

        $callback = function() use ($attendances) {
            $csv = Writer::createFromString('');
            $csv->insertOne(['Employee ID', 'Employee Name', 'Date', 'Status']);

            foreach ($attendances as $attendance) {
                $csv->insertOne([
                    $attendance->employee_id,
                    $attendance->employee_name,
                    $attendance->date,
                    $attendance->status,
                ]);
            }

            echo $csv->getContent();
        };

        return new StreamedResponse($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="attendance.csv"',
        ]);
    }

    public function selfAttendance(Request $request)
    {
        // Instead of using auth()->user(), let's get a random employee_id
        $employeeId = Attendance::inRandomOrder()->value('employee_id');
    
        if (!$employeeId) {
            return response()->json(['error' => 'No attendance records found'], 404);
        }
    
        $query = $this->buildQuery($request)->where('employee_id', $employeeId);
        $attendances = $query->get();
    
        $attendanceData = $this->formatSelfAttendance($attendances);
        $summary = $this->calculateSummary($attendances);
    
        return response()->json([
            'attendanceData' => $attendanceData,
            'summary' => $summary,
        ]);
    }
    public function selfAttendanceDownload(Request $request)
    {
        $employeeId = Attendance::inRandomOrder()->value('employee_id');
    
        if (!$employeeId) {
            return response()->json(['error' => 'No attendance records found'], 404);
        }
    
        $query = $this->buildQuery($request)->where('employee_id', $employeeId);
        $attendances = $query->get();
    
        $callback = function() use ($attendances) {
            $csv = Writer::createFromString('');
            $csv->insertOne(['Date', 'Status', 'Clock In', 'Clock Out', 'Over Time', 'Worked', 'Expected', 'Variance']);
    
            foreach ($attendances as $attendance) {
                $csv->insertOne([
                    $attendance->date,
                    $attendance->status,
                    $attendance->clock_in,
                    $attendance->clock_out,
                    $attendance->over_time,
                    $attendance->worked,
                    $attendance->expected,
                    $attendance->variance,
                ]);
            }
    
            echo $csv->getContent();
        };
    
        return new StreamedResponse($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="self_attendance.csv"',
        ]);
    }

    private function buildQuery(Request $request)
{
    $query = Attendance::query();

    if ($request->filled(['startDate', 'endDate'])) {
        $query->whereBetween('date', [$request->startDate, $request->endDate]);
    }

    if ($request->filled('name')) {
        $query->where(function($q) use ($request) {
            $q->where('employee_name', 'like', '%' . $request->name . '%')
              ->orWhere('employee_id', 'like', '%' . $request->name . '%');
        });
    }

    // Keep the month and year filters if you still need them
    if ($request->filled(['month', 'year'])) {
        $query->whereMonth('date', $request->month)
              ->whereYear('date', $request->year);
    } elseif ($request->filled('month')) {
        $query->whereMonth('date', $request->month);
    } elseif ($request->filled('year')) {
        $query->whereYear('date', $request->year);
    }

    return $query;
}

    private function groupAttendances($attendances)
    {
        return $attendances->groupBy('employee_id')->map(function ($employeeAttendances) {
            $firstAttendance = $employeeAttendances->first();
            return [
                'id' => $firstAttendance->employee_id,
                'name' => $firstAttendance->employee_name,
                'days' => $employeeAttendances->pluck('status', 'date')->toArray(),
            ];
        })->values();
    }

    private function formatSelfAttendance($attendances)
    {
        return $attendances->map(function ($attendance) {
            return [
                'date' => $attendance->date,
                'status' => $attendance->status,
                'clockIn' => $attendance->clock_in,
                'clockOut' => $attendance->clock_out,
                'overTime' => $attendance->over_time,
                'worked' => $attendance->worked,
                'expected' => $attendance->expected,
                'variance' => $attendance->variance,
            ];
        });
    }

    private function calculateSummary($attendances)
    {
        $expected = $attendances->count();
        $present = $attendances->where('status', 'present')->count();
        $tardy = $attendances->where('status', 'tardy')->count();

        $totalWorked = $attendances->sum('worked');
        $totalExpected = $attendances->sum('expected');
        $totalOverTime = $attendances->sum('over_time');

        return [
            'expected' => $expected,
            'present' => $present,
            'tardy' => $tardy,
            'expectedHours' => $this->formatHours($totalExpected),
            'variance' => $this->formatHours($totalWorked - $totalExpected),
            'overTime' => $this->formatHours($totalOverTime),
        ];
    }

    private function formatHours($minutes)
    {
        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;
        return sprintf("%02d:%02d:00", $hours, $remainingMinutes);
    }

    public function markAttendance(Request $request)
    {
        try {
            $validated = $request->validate([
                'business_unit' => 'required|exists:business_units,id',
                'department' => 'required|exists:departments,id',
                'designation' => 'required|exists:designations,id',
                'employee_id' => 'required|exists:employees,id',
                'date' => 'required|date',
                'punch_in' => 'required|date_format:H:i',
                'punch_out' => 'required|date_format:H:i|after:punch_in',
                'is_late' => 'boolean',
                'is_half_day' => 'boolean',
                'working_from' => 'nullable|string',
                'attendance_overwrite' => 'boolean',
            ]);
    
            $employee = Employee::findOrFail($validated['employee_id']);
    
            // Check if attendance record already exists
            $existingAttendance = Attendance::where('employee_id', $validated['employee_id'])
                ->where('date', $validated['date'])
                ->first();
    
            if ($existingAttendance && !$validated['attendance_overwrite']) {
                return response()->json(['message' => 'Attendance record already exists'], 422);
            }
    
            // Calculate worked hours and overtime
            $punchIn = Carbon::createFromFormat('H:i', $validated['punch_in']);
            $punchOut = Carbon::createFromFormat('H:i', $validated['punch_out']);
            $workedMinutes = $punchOut->diffInMinutes($punchIn);
            $expectedMinutes = 480; // 8 hours
            $overTimeMinutes = max(0, $workedMinutes - $expectedMinutes);
    
            $attendanceData = [
                'employee_id' => $validated['employee_id'],
                'employee_name' => $employee->name,
                'date' => $validated['date'],
                'status' => $validated['is_half_day'] ? 'half_day' : ($validated['is_late'] ? 'tardy' : 'present'),
                'clock_in' => $validated['punch_in'],
                'clock_out' => $validated['punch_out'],
                'over_time' => $overTimeMinutes,
                'worked' => $workedMinutes,
                'expected' => $expectedMinutes,
                'variance' => $workedMinutes - $expectedMinutes,
            ];
    
            if ($existingAttendance) {
                $existingAttendance->update($attendanceData);
                $attendance = $existingAttendance;
            } else {
                $attendance = Attendance::create($attendanceData);
            }
    
            return response()->json($attendance, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Error in markAttendance: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while processing your request'], 500);
        }
    }

    public function getEmployees()
    {
        try {
            $employees = Employee::select('id', 'name')->get();
            return response()->json($employees);
        } catch (\Exception $e) {
            \Log::error('Error in getEmployees: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function getBusinessUnits()
    {
        try {
            $businessUnits = BusinessUnit::select('id', 'name')->get();
            return response()->json($businessUnits);
        } catch (\Exception $e) {
            \Log::error('Error in getBusinessUnits: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function getDepartments()
    {
        try {
            $departments = Department::select('id', 'name')->get();
            return response()->json($departments);
        } catch (\Exception $e) {
            \Log::error('Error in getDepartments: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function getDesignations()
    {
        try {
            $designations = Designation::select('id', 'name')->get();
            return response()->json($designations);
        } catch (\Exception $e) {
            \Log::error('Error in getDesignations: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
}