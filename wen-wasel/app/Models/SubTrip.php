<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubTrip extends Model
{
    use HasFactory;

    protected $fillable = [
        'trip_info_id',
        'trip_type',
        'trip_id',
        'directions',
    ];

    public function tripInfo(){
        return $this->belongsTo(TripInfo::class);
    }

    public function tripType(){
        return $this->belongsTo(TripType::class);
    }

    public function trip(){
        return $this->belongsTo(Trip::class);
    }

    

}
