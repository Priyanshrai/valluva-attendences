<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AttendanceController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::apiResource('attendances', AttendanceController::class);


Route::get('attendances/download', [AttendanceController::class, 'download']);


Route::get('/self-attendance', [AttendanceController::class, 'selfAttendance']);
Route::get('/self-attendance/download', [AttendanceController::class, 'selfAttendanceDownload']);
Route::post('/mark-attendance', [AttendanceController::class, 'markAttendance']);


Route::get('/employees', [AttendanceController::class, 'getEmployees']);
Route::get('/business-units', [AttendanceController::class, 'getBusinessUnits']);
Route::get('/departments', [AttendanceController::class, 'getDepartments']);
Route::get('/designations', [AttendanceController::class, 'getDesignations']);