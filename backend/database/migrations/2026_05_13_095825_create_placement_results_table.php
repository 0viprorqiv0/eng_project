<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('placement_results', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->enum('profile_type', ['student_11_12', 'ielts', 'working']);
            $table->enum('current_level', ['beginner', 'elementary', 'intermediate', 'advanced']);
            $table->string('goal')->nullable();
            $table->integer('score');              // số câu đúng
            $table->integer('total')->default(20);
            $table->string('level_result');         // Beginner / Elementary / ...
            $table->json('answers_summary');        // [{category, isCorrect, difficulty}]
            $table->text('ai_analysis')->nullable();
            $table->string('suggested_course')->nullable();
            $table->boolean('consent')->default(false);
            $table->timestamps();

            $table->index('email');
            $table->index('profile_type');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('placement_results');
    }
};
