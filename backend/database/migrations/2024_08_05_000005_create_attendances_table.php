<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->string('employee_name');
            $table->date('date');
            $table->string('status');
            $table->time('clock_in')->nullable();
            $table->time('clock_out')->nullable();
            $table->integer('over_time')->default(0);
            $table->integer('worked')->default(0);
            $table->integer('expected')->default(480);
            $table->integer('variance')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendances');
    }
};