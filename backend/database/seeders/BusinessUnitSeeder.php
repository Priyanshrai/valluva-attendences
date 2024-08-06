<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusinessUnit;

class BusinessUnitSeeder extends Seeder
{
    public function run()
    {
        $units = [
            ['name' => 'IT'],
            ['name' => 'HR'],
            ['name' => 'Finance'],
            ['name' => 'Marketing'],
        ];

        foreach ($units as $unit) {
            BusinessUnit::create($unit);
        }
    }
}