<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $table = 'employees';


    protected $fillable = [
        'id', 'name', 'business_unit_id', 'department_id', 'designation_id'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function businessUnit()
    {
        return $this->belongsTo(BusinessUnit::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }
}