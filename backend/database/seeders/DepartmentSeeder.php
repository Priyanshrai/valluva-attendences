<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            ['name' => 'Software Development'],
            ['name' => 'Quality Assurance'],
            ['name' => 'Human Resources'],
            ['name' => 'Accounting'],
            ['name' => 'Digital Marketing'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}