<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'trip_info_id',
    ];

    public function driver(){
        return $this->belongsTo(Driver::class);
    }

    public function tripInfo(){
        return $this->belongsTo(TripInfo::class);
    }

}
