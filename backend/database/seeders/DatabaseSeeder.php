<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            BusinessUnitSeeder::class,
            DepartmentSeeder::class,
            DesignationSeeder::class,
            AttendanceSeeder::class,
        ]);
    }
}