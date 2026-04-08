<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('score')->default(0);
            $table->integer('total_questions')->default(0);
            $table->json('answers_data')->nullable(); // user's choices
            $table->json('essay_answers')->nullable(); // user's essay texts
            $table->integer('time_spent')->default(0); // in seconds
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};
