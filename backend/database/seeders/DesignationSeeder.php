<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Designation;

class DesignationSeeder extends Seeder
{
    public function run()
    {
        $designations = [
            ['name' => 'Software Engineer'],
            ['name' => 'QA Tester'],
            ['name' => 'HR Manager'],
            ['name' => 'Accountant'],
            ['name' => 'Marketing Specialist'],
        ];

        foreach ($designations as $designation) {
            Designation::create($designation);
        }
    }
}