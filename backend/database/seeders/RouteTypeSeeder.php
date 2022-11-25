<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RouteType;

class RouteTypeSeeder extends Seeder
{
    public function run(){
        RouteType::create([
            'type' => 'One Time',
        ]);

        RouteType::create([
            'type' => 'Scheduled',
        ]);
    }
}
