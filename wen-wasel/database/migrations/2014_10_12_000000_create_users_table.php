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
    public function up()
    {
        Schema::create('user_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type');
        });

        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("user_type")->unsigned();
            $table->foreign('user_type')->references('id')->on('user_types')->onDelete('cascade');
            $table->string("name");
            $table->integer("phone");
            $table->string("email");
            $table->string("password");
            $table->string("image")->nullable();
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
        Schema::dropIfExists('users');
        Schema::dropIfExists('user_types');
    }
};
