<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('icon')->default('assignment');       // material icon name
            $table->date('due_date');
            $table->integer('max_score')->default(10);
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->timestamps();
        });

        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->text('content')->nullable();                 // text answer
            $table->string('file_url')->nullable();              // uploaded file
            $table->decimal('score', 5, 1)->nullable();          // 8.5
            $table->text('feedback')->nullable();                // teacher feedback
            $table->enum('status', ['submitted', 'graded'])->default('submitted');
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();

            $table->unique(['assignment_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('assignments');
    }
};
