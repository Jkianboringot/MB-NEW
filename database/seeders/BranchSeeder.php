<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Branch::insert([
            ['name' => 'mb1', 'location' => 'Calatagan', 'branch_type' => 'branch'],
            ['name' => 'mb2', 'location' => 'San Andres', 'branch_type' => 'franchise'],
            ['name' => 'mb3', 'location' => 'San Juan', 'branch_type' => 'center'],
        ]);
    }
}
