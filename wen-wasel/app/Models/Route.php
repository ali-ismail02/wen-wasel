<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_type',
        'driver_id',
        'presaved_route_id',
        'location',
        'time_difference',
        'arrival_status',
        'arrival_time',
    ];

    public function route_type(){
        return $this->belongsTo(RouteTypes::class);
    }

    public function driver(){
        return $this->belongsTo(Driver::class);
    }

    public function presaved_route(){
        return $this->belongsTo(PresavedRoute::class);
    }

    public function reservations(){
        return $this->hasMany(Reservation::class);
    }

}
