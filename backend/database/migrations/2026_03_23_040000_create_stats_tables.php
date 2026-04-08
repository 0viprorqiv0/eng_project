<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->boolean('is_completed')->default(false);
            $table->string('progress')->nullable();       // "7/10"
            $table->date('date');
            $table->timestamps();
        });

        Schema::create('learning_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('duration_minutes');
            $table->date('logged_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_logs');
        Schema::dropIfExists('daily_goals');
    }
};
