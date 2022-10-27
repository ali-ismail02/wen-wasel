<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripType extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
    ];

    public function subTrips(){
        return $this->hasMany(SubTrip::class);
    }
}
