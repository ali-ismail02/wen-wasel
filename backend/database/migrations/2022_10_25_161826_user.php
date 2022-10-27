<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function  up()
    {
        Schema::create('route_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type');
            $table->timestamps();
        });

        Schema::create('trip_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type');
            $table->timestamps();
        });

        Schema::create('drivers', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("user_id")->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string("make");
            $table->string("model");
            $table->integer("year");
            $table->string("license_plate");
            $table->string("license");
            $table->string("front_image");
            $table->string("side_image");
            $table->integer("seats");
            $table->timestamps();
        });

        Schema::create('presaved_routes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("driver_id")->unsigned();
            $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('cascade');
            $table->string("name");
            $table->dateTime('start_time', $precision = 0)->nullable();
            $table->timestamps();
        });

        Schema::create('routes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("driver_id")->unsigned();
            $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('cascade');
            $table->integer("route_type")->unsigned();
            $table->foreign('route_type')->references('id')->on('route_types')->onDelete('cascade');
            $table->integer("presaved_route_id")->unsigned()->nullable()->constrained();;
            $table->foreign('presaved_route_id')->references('id')->on('presaved_routes')->onDelete('cascade');
            $table->string("location");
            $table->integer("time_difference")->nullable();
            $table->integer("arrival_status");
            $table->dateTime('arrival_time', $precision = 0)->nullable();
            $table->timestamps();
        });

        Schema::create('reservations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("user_id")->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer("route_id")->unsigned();
            $table->foreign('route_id')->references('id')->on('routes')->onDelete('cascade');
            $table->integer("status");
            $table->timestamps();
        });
        
        Schema::create('trips', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("user_id")->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('trip_infos', function (Blueprint $table) {
            $table->increments('id');
            $table->string("start_location");
            $table->string("end_location");
            $table->dateTime('departure_time', $precision = 0)->nullable();
            $table->dateTime('arrival_time', $precision = 0)->nullable();
            $table->timestamps();
        });

        Schema::create('sub_trips', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("trip_id")->unsigned();
            $table->foreign('trip_id')->references('id')->on('trips')->onDelete('cascade');
            $table->integer("trip_info_id")->unsigned();
            $table->foreign('trip_info_id')->references('id')->on('trip_infos')->onDelete('cascade');
            $table->integer("trip_type")->unsigned();
            $table->foreign('trip_type')->references('id')->on('trip_types')->onDelete('cascade');
            $table->string("directions");
            $table->timestamps();
        });

        Schema::create('trip_records',function(Blueprint $table){
            $table->increments('id');
            $table->integer("driver_id")->unsigned();
            $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('cascade');
            $table->integer("trip_info_id")->unsigned();
            $table->foreign('trip_info_id')->references('id')->on('trip_infos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trip_records');
        Schema::dropIfExists('sub_trips');
        Schema::dropIfExists('trip_infos');
        Schema::dropIfExists('trips');
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('routes');
        Schema::dropIfExists('presaved_routes');
        Schema::dropIfExists('drivers');
        Schema::dropIfExists('trip_types');
        Schema::dropIfExists('route_types');

    }
};
