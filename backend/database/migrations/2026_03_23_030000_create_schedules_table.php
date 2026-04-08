<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('location')->nullable();          // "Phòng trực tuyến 04"
            $table->string('time_slot');                      // "08:00 - 09:30"
            $table->tinyInteger('day_of_week');               // 0=Sun, 1=Mon...6=Sat
            $table->string('color', 30)->default('border-[#13375f]');
            $table->enum('type', ['live', 'offline', 'recorded'])->default('live');
            $table->integer('max_students')->default(12);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
