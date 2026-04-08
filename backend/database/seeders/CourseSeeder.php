<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $teacher1 = User::where('email', 'teacher@beelearn.vn')->first();
        $teacher2 = User::where('email', 'teacher2@beelearn.vn')->first();
        $teacher3 = User::where('email', 'teacher3@beelearn.vn')->first();
        $teacher4 = User::where('email', 'teacher4@beelearn.vn')->first();
        $student = User::where('email', 'student@beelearn.vn')->first();

        $coursesData = [
            [
                'slug'         => 'grammar',
                'title'        => 'KHÓA 1: TỔNG ÔN NGỮ PHÁP',
                'subtitle'     => 'Xây gốc - Mục tiêu 7+',
                'description'  => 'Hệ thống hóa toàn bộ kiến thức ngữ pháp trọng tâm 12 năm học chỉ trong 1 khóa duy nhất.',
                'outcome'      => 'Nắm vững 100% các chuyên đề ngữ pháp cốt lõi, loại bỏ hoàn toàn lỗi sai cơ bản.',
                'price'        => '1.990.000đ',
                'price_amount' => 1990000,
                'category'     => 'Lớp 12',
                'level'        => 'Mục tiêu 7+',
                'duration'     => '24',
                'color'        => 'navy',
                'teacher_id'   => $teacher4 ? $teacher4->id : null,
                'rating'       => 4.9,
                'structures'   => ['Thì & Sự phối hợp thì', 'Câu bị động & Câu tường thuật', 'Mệnh đề quan hệ & Câu điều kiện', 'Tổng ôn & Giải đề trọng tâm'],
                'features'     => [
                    ['title' => 'Cơ bản đến nâng cao', 'desc' => 'Lộ trình phù hợp cho cả người mất gốc.', 'icon' => 'BookOpen'],
                    ['title' => 'Học liệu độc quyền', 'desc' => 'Mindmap sơ đồ tư duy tóm tắt sau mỗi bài.', 'icon' => 'Gauge'],
                    ['title' => 'Ngân hàng 1000+ câu', 'desc' => 'Bài tập thực hành sát đề thi thật nhất.', 'icon' => 'Brain'],
                    ['title' => 'Hỗ trợ 1-1', 'desc' => 'Giáo viên giải đáp thắc mắc ngay lập tức.', 'icon' => 'Award'],
                ],
                'testimonials' => [
                    ['name' => 'Lê Minh', 'role' => 'Lớp 12A1', 'text' => 'Bản thân mình từ 4 điểm lên 8.5 sau 3 tháng học tập trung tại đây.', 'stats' => '8.5 Overall'],
                    ['name' => 'Hoàng Nam', 'role' => 'Học sinh lớp 12', 'text' => 'Ngữ pháp không còn là nỗi sợ, mình đã nắm chắc 10 điểm trong đề thi thử.', 'stats' => '10.0 Grammar'],
                ],
                'lessons_data' => [
                    [
                        'title' => 'Tổng quan 12 thì',
                        'type' => 'video',
                        'content' => 'Video hệ thống hóa kiến thức 12 thì do nhóm thực hiện biên soạn. Thời lượng 12 phút cô đọng, tóm tắt cực kì ngắn gọn.',
                        'video_path' => 'lessons/video-12-thi.mp4',
                    ],
                    [
                        'title' => 'Tài liệu 12 thì',
                        'type' => 'document',
                        'content' => 'Sách PDF: Tổng hợp tất cả cấu trúc 12 thì tiếng Anh chuẩn của Langmaster, giải thích cực kỳ chi tiết.',
                        'materials_path' => 'lessons/document-12-thi.pdf',
                    ],
                    [
                        'title' => 'Quiz kiểm tra 12 thì',
                        'type' => 'quiz',
                        'content' => 'Làm ngay 10 câu trắc nghiệm sau khi học xong để kiểm tra mức độ nắm kiến thức của bạn.',
                        'questions_data_file' => 'lessons/quiz.json'
                    ],
                    [
                        'title' => 'Bài tập tự luận 12 thì',
                        'type' => 'assignment',
                        'content' => 'Tải file Word đính kèm về máy, hoàn thành các bài tập chia động từ theo đúng ngữ pháp, sau đó lưu lại và nộp lên hệ thống.',
                        'materials_path' => 'lessons/homework-12-thi.docx',
                        'assignment_title' => 'Hoàn thành bài tập điền thì quá khứ/hiện tại'
                    ]
                ]
            ],
            [
                'slug'         => 'khoa-2-tu-vung',
                'title'        => 'KHÓA 2: CHUYÊN SÂU TỪ VỰNG & ĐỌC HIỂU (THPT QG)',
                'subtitle'     => 'Bứt phá 9+ THPT Quốc Gia',
                'description'  => 'Phương pháp học từ vựng qua ngữ cảnh và hình ảnh, giúp ghi nhớ lâu hơn 300%.',
                'outcome'      => 'Sở hữu vốn từ vựng 3000+ từ thông dụng và học thuật.',
                'price'        => '1.500.000đ',
                'price_amount' => 1500000,
                'category'     => 'Lớp 12',
                'level'        => 'Mục tiêu 9+',
                'duration'     => '20',
                'color'        => 'beered',
                'teacher_id'   => $teacher4 ? $teacher4->id : null,
                'rating'       => 4.8,
                'structures'   => ['Word Formation & Collocations', 'Học từ vựng theo chủ đề (Topics)', 'Kỹ thuật đoán nghĩa từ trong câu', 'Flashcard & Kiểm tra định kỳ'],
                'features'     => [
                    ['title' => 'Ghi nhớ hình ảnh', 'desc' => 'Audio-Visual giúp nhớ từ vựng lâu hơn.', 'icon' => 'Brain'],
                    ['title' => 'Collocations thực tế', 'desc' => 'Cách dùng từ như người bản xứ.', 'icon' => 'Users'],
                    ['title' => 'Phòng thi giả lập', 'desc' => 'Kiểm tra từ vựng hàng tuần.', 'icon' => 'ShieldCheck'],
                    ['title' => 'Tài liệu PDF', 'desc' => 'Tải về học mọi lúc mọi nơi.', 'icon' => 'BookOpen'],
                ],
                'testimonials' => [
                    ['name' => 'Thu Hà', 'role' => 'Sinh viên Ngoại Thương', 'text' => 'Từ vựng không còn là nỗi ám ảnh với mình nữa. Phương pháp học rất thông minh.', 'stats' => '9.5 Reading'],
                    ['name' => 'Văn Hùng', 'role' => 'Học sinh lớp 12', 'text' => 'Kho từ vựng khổng lồ và rất dễ nhớ qua mindmap.', 'stats' => '9.0 Vocabulary'],
                ],
                'lessons_titles' => ['Phương pháp Spaced Repetition', 'Chủ đề Education & Technology', 'Tiền tố và Hậu tố thông dụng', 'Cụm động từ (Phrasal Verbs) hay gặp', 'Chiến thuật đoán nghĩa từ mới']
            ],
            [
                'slug'         => 'khoa-3-cau',
                'title'        => 'KHÓA 3: LUYỆN ĐỀ CẤP TỐC (THỰC CHIẾN THPT QG)',
                'subtitle'     => 'Thực chiến đề thi THPT QG',
                'description'  => 'Từ câu đơn đến câu phức, từ đoạn văn ngắn đến bài luận hoàn chỉnh.',
                'outcome'      => 'Tự tin viết 500+ từ với bố cục mạch lạc và ngữ pháp chuẩn.',
                'price'        => '1.800.000đ',
                'price_amount' => 1800000,
                'category'     => 'Lớp 12',
                'level'        => 'Cấp tốc luyện đề',
                'duration'     => '22',
                'color'        => 'navy',
                'teacher_id'   => $teacher4 ? $teacher4->id : null,
                'rating'       => 4.7,
                'structures'   => ['Cấu trúc câu ghép và câu phức', 'Cách sử dụng từ nối (Connectors)', 'Bố cục một đoạn văn tiêu chuẩn', 'Thực hành viết theo chủ đề'],
                'features'     => [
                    ['title' => 'Chấm chữa 1-1', 'desc' => 'Giáo viên chỉnh lỗi chi tiết từng câu.', 'icon' => 'Clock'],
                    ['title' => 'Ngân hàng bài mẫu', 'desc' => 'Tham khảo các bài viết đạt điểm cao.', 'icon' => 'Award'],
                    ['title' => 'Tư duy logic', 'desc' => 'Xây dựng dàn ý mạch lạc trước khi viết.', 'icon' => 'Brain'],
                    ['title' => 'Phản hồi nhanh', 'desc' => 'Nhận xét bài làm trong vòng 24h.', 'icon' => 'Heart'],
                ],
                'testimonials' => [
                    ['name' => 'Hoàng Nam', 'role' => 'Học sinh lớp 12', 'text' => 'Giờ mình viết rất trôi chảy, không còn lúng túng.', 'stats' => '8.0 Writing'],
                ],
                'lessons_titles' => ['Nguyên tắc viết câu đơn chuẩn', 'Kết nối ý tưởng bằng Cohesion', 'Cách viết Topic Sentence hay', 'Tránh lỗi lặp từ trong đoạn văn', 'Thực hành viết bài luận ngắn']
            ],
            [
                'slug'         => 'ielts-foundation',
                'title'        => 'IELTS FOUNDATION 5.0+',
                'subtitle'     => 'Làm quen 4 kỹ năng',
                'description'  => 'Thiết kế riêng cho người mới bắt đầu luyện thi IELTS từ con số 0.',
                'outcome'      => 'Đạt trình độ tương đương 5.0 - 5.5 IELTS toàn diện.',
                'price'        => '2.500.000đ',
                'price_amount' => 2500000,
                'category'     => 'IELTS',
                'level'        => 'Mục tiêu 5.5',
                'duration'     => '30',
                'color'        => 'beered',
                'teacher_id'   => $teacher1 ? $teacher1->id : null,
                'rating'       => 4.9,
                'structures'   => ['Phát âm & Ngữ pháp IELTS', 'Kỹ năng Nghe & Đọc cơ bản', 'Luyện nói Part 1 & Viết Task 1', 'Thi thử đánh giá trình độ'],
                'features'     => [
                    ['title' => 'Chuẩn phát âm IPA', 'desc' => 'Nói đúng ngay từ khi bắt đầu.', 'icon' => 'Clock'],
                    ['title' => 'Học từ vựng Academic', 'desc' => 'Tiếp cận 1000+ từ học thuật.', 'icon' => 'GraduationCap'],
                    ['title' => 'Mô phỏng phòng thi', 'desc' => 'Làm quen áp lực thi cử từ sớm.', 'icon' => 'Gauge'],
                    ['title' => 'Lộ trình cá nhân', 'desc' => 'Theo sát điểm mạnh yếu của bạn.', 'icon' => 'ShieldCheck'],
                ],
                'testimonials' => [
                    ['name' => 'Thùy Chi', 'role' => 'Mới bắt đầu', 'text' => 'Khóa học giúp mình có cái nhìn tổng quan về IELTS.', 'stats' => 'Target 5.5'],
                ],
                'lessons_titles' => ['Giới thiệu format đề thi IELTS', 'Kỹ thuật Skimming & Scanning', 'Cách trả lời Part 1 tự nhiên', 'Ngữ pháp ăn điểm trong IELTS', 'Luyện nghe số và tên riêng']
            ],
            [
                'slug'         => 'ielts-6-5',
                'title'        => 'IELTS TARGET 6.5',
                'subtitle'     => 'Tăng tốc - Bứt phá band điểm',
                'description'  => 'Tập trung vào các chiến thuật làm bài thực chiến để lấy điểm 6.5+.',
                'outcome'      => 'Sẵn sàng chinh phục chứng chỉ IELTS phục vụ du học hoặc miễn thi.',
                'price'        => '2.800.000đ',
                'price_amount' => 2800000,
                'category'     => 'IELTS',
                'level'        => 'Mục tiêu 6.5',
                'duration'     => '30',
                'color'        => 'navy',
                'teacher_id'   => $teacher2 ? $teacher2->id : null,
                'rating'       => 4.8,
                'structures'   => ['Chiến thuật Reading nâng cao', 'Nâng tầm Speaking Part 2 & 3', 'Writing Task 1 & 2 chuyên sâu', 'Giải đề thi thật các năm'],
                'features'     => [
                    ['title' => 'Topic Vocabulary', 'desc' => 'Từ vựng theo 10 chủ đề hay gặp.', 'icon' => 'BookOpen'],
                    ['title' => 'Template Writing', 'desc' => 'Dàn ý giúp tiết kiệm 30% thời gian.', 'icon' => 'Clock'],
                    ['title' => 'Luyện nói 1-1', 'desc' => 'Sửa lỗi ngắt nghỉ, ngữ điệu.', 'icon' => 'Users'],
                    ['title' => 'Update đề liên tục', 'desc' => 'Luôn cập nhật xu hướng đề thi mới.', 'icon' => 'Gauge'],
                ],
                'testimonials' => [
                    ['name' => 'Minh Anh', 'role' => 'Lớp 11', 'text' => 'Mình đã đạt vượt mục tiêu 7.0 chỉ sau 1 khóa học cực kì chất lượng.', 'stats' => '7.0 Overall'],
                    ['name' => 'Phương Thảo', 'role' => 'Học sinh chuyên Anh', 'text' => 'Chiến thuật làm bài cực kì thực chiến, giúp mình tối ưu thời gian.', 'stats' => '7.5 Listening'],
                ],
                'lessons_titles' => ['Xử lý dạng bài Matching Headings', 'Phát triển ý tưởng Speaking Part 2', 'Cấu trúc bài viết Writing Task 2', 'Listening Section 3 & 4 Tips', 'Tăng tốc độ đọc hiểu văn bản']
            ],
            [
                'slug'         => 'ielts-mastery',
                'title'        => 'IELTS BỨT PHÁ 8.0+',
                'subtitle'     => 'Chinh phục band điểm xuất sắc',
                'description'  => 'Dành cho các bạn muốn tối ưu hóa điểm số lên 8.0+ toàn diện 4 kỹ năng.',
                'outcome'      => 'Nắm giữ bí kíp đạt điểm tuyệt đối Listening/Reading và 7.5+ W/S.',
                'price'        => '3.500.000đ',
                'price_amount' => 3500000,
                'category'     => 'IELTS',
                'level'        => 'Mục tiêu 8.0+',
                'duration'     => '36',
                'color'        => 'beered',
                'teacher_id'   => $teacher2 ? $teacher2->id : null,
                'rating'       => 5.0,
                'structures'   => ['Critical Thinking in Writing', 'Native-like Speaking styles', 'Mastering Difficult Reading texts', 'Intensive Mock Tests'],
                'features'     => [
                    ['title' => 'Collocations Band 8+', 'desc' => 'Dùng từ tinh tế như người bản xứ.', 'icon' => 'Medal'],
                    ['title' => 'Sửa bài kĩ lưỡng', 'desc' => 'Giải thích từng lỗi Task Response.', 'icon' => 'Brain'],
                    ['title' => 'Cập nhật Forecast', 'desc' => 'Đoán đúng 80% chủ đề Speaking.', 'icon' => 'Gauge'],
                    ['title' => 'Cộng đồng học thuật', 'desc' => 'Trao đổi cùng các cao thủ 8.0+.', 'icon' => 'Users'],
                ],
                'testimonials' => [
                    ['name' => 'Anh Tuấn', 'role' => 'Giáo viên Tiếng Anh', 'text' => 'Khóa học thực sự mở mang tư duy học thuật.', 'stats' => '8.5 Overall'],
                ],
                'lessons_titles' => ['Lối viết Academic chuẩn mực', 'Phản biện trong IELTS Speaking', 'Xử lý các bẫy Reading tinh vi', 'Tối ưu hóa thời gian Writing', 'Chiến thuật đạt 9.0 Listening']
            ],
            [
                'slug'         => 'english-comm',
                'title'        => 'TIẾNG ANH GIAO TIẾP',
                'subtitle'     => 'Phản xạ tự tin - Nói chuẩn bản xứ',
                'description'  => 'Xóa tan rào cản sợ nói, giúp bạn giao tiếp lưu loát mọi tình huống hàng ngày.',
                'outcome'      => 'Tự tin trò chuyện với người nước ngoài về các chủ đề đời sống.',
                'price'        => '2.000.000đ',
                'price_amount' => 2000000,
                'category'     => 'Người đi làm',
                'level'        => 'Cơ bản/Trung bình',
                'duration'     => '24',
                'color'        => 'navy',
                'teacher_id'   => $teacher3 ? $teacher3->id : null,
                'rating'       => 4.9,
                'structures'   => ['Phát âm chuẩn (Pronunciation)', 'Phản xạ hội thoại 5 giây', 'Giao tiếp theo tình huống (Situations)', 'Vượt qua nỗi sợ nói tiếng Anh'],
                'features'     => [
                    ['title' => 'Học qua Role-play', 'desc' => 'Thực hành đóng vai tình huống thực.', 'icon' => 'Users'],
                    ['title' => 'Correcting lỗi sai', 'desc' => 'Giáo viên chỉnh âm tại chỗ.', 'icon' => 'Clock'],
                    ['title' => 'Văn hóa bản xứ', 'desc' => 'Hiểu cách dùng từ của người Tây.', 'icon' => 'Heart'],
                    ['title' => 'Kết nối bạn bè', 'desc' => 'Môi trường thực hành năng động.', 'icon' => 'Users'],
                ],
                'testimonials' => [
                    ['name' => 'Chị Mai', 'role' => 'Kế toán', 'text' => 'Mình đã có thể tự tin đi du lịch nước ngoài và nói chuyện với người bản xứ.', 'stats' => 'Confidence++'],
                    ['name' => 'Anh Quân', 'role' => 'Nhân viên VP', 'text' => 'Môi trường học năng động, giúp mình phản xạ rất nhanh.', 'stats' => 'Fluent Speaker'],
                ],
                'lessons_titles' => ['Làm quen & Giới thiệu bản thân', 'Hỏi đường & Di chuyển', 'Đặt bàn nhà hàng & Gọi món', 'Trao đổi về sở thích & Đam mê', 'Kể chuyện bằng tiếng Anh']
            ],
            [
                'slug'         => 'english-office',
                'title'        => 'TIẾNG ANH CÔNG SỞ',
                'subtitle'     => 'Làm việc chuyên nghiệp - Thăng tiến nhanh',
                'description'  => 'Trang bị kỹ năng tiếng Anh cần thiết trong môi trường làm việc đa quốc gia.',
                'outcome'      => 'Sử dụng tiếng Anh thành thạo trong Email, Họp hành và Thuyết trình.',
                'price'        => '2.500.000đ',
                'price_amount' => 2500000,
                'category'     => 'Người đi làm',
                'level'        => 'Trình độ khá',
                'duration'     => '20',
                'color'        => 'beered',
                'teacher_id'   => $teacher3 ? $teacher3->id : null,
                'rating'       => 4.8,
                'structures'   => ['Viết Email thương mại (Email)', 'Kỹ năng họp hành (Meetings)', 'Thuyết trình chuyên nghiệp (Presenting)', 'Đàm phán & Thương lượng (Negotiation)'],
                'features'     => [
                    ['title' => 'Kỹ năng mềm', 'desc' => 'Kết hợp tiếng Anh với xử lý tình huống.', 'icon' => 'ShieldCheck'],
                    ['title' => 'Template chuyên nghiệp', 'desc' => 'Kho mẫu mail, slide chuẩn quốc tế.', 'icon' => 'Gauge'],
                    ['title' => 'Phản hồi chuyên gia', 'desc' => 'Chỉnh sửa lỗi dùng từ trang trọng.', 'icon' => 'Award'],
                    ['title' => 'Networking', 'desc' => 'Mở rộng mối quan hệ đồng nghiệp.', 'icon' => 'Users'],
                ],
                'testimonials' => [
                    ['name' => 'Anh Đức', 'role' => 'Manager', 'text' => 'Khóa học giúp mình tự tin họp với sếp nước ngoài.', 'stats' => 'Promoted!'],
                ],
                'lessons_titles' => ['Viết Email thông báo & Yêu cầu', 'Cách điều phối một cuộc họp trực tuyến', 'Mở đầu bài thuyết trình ấn tượng', 'Xử lý các tình huống khó xử', 'Đàm phán về thời hạn & Ngân sách']
            ]
        ];

        foreach ($coursesData as $data) {
            $structures = $data['structures'];
            $lessonsTitles = $data['lessons_titles'] ?? [];
            $lessonsData = $data['lessons_data'] ?? [];
            unset($data['structures'], $data['lessons_titles'], $data['lessons_data']);

            $course = Course::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );

            // Create structures
            $course->structures()->delete();
            foreach ($structures as $i => $content) {
                $course->structures()->create([
                    'content'    => $content,
                    'sort_order' => $i,
                ]);
            }

            // Create sample lessons
            $course->lessons()->delete();
            if (!empty($lessonsData)) {
                foreach ($lessonsData as $i => $lData) {
                    $questionsData = $lData['questions_data'] ?? null;
                    if (isset($lData['questions_data_file'])) {
                        $json = @file_get_contents(storage_path('app/public/' . $lData['questions_data_file']));
                        if ($json) {
                            $questionsData = json_decode($json, true);
                        }
                    }

                    $lesson = $course->lessons()->create([
                        'title'            => "Bài " . ($i + 1) . ": " . $lData['title'],
                        'lesson_type'      => $lData['type'],
                        'content'          => $lData['content'],
                        'duration_minutes' => rand(15, 60),
                        'sort_order'       => $i + 1,
                        'questions_data'   => $questionsData,
                        'video_path'       => $lData['video_path'] ?? null,
                        'materials_path'   => $lData['materials_path'] ?? null,
                    ]);

                    if ($lData['type'] === 'assignment') {
                        \App\Models\Assignment::create([
                            'course_id'  => $course->id,
                            'lesson_id'  => $lesson->id,
                            'teacher_id' => $course->teacher_id,
                            'title'      => $lData['assignment_title'] ?? $lData['title'],
                            'max_score'  => 100,
                            'due_date'   => now()->addDays(7),
                        ]);
                    }
                }
            } else {
                foreach ($lessonsTitles as $i => $title) {
                    $course->lessons()->create([
                        'title'            => "Bài " . ($i + 1) . ": " . $title,
                        'content'          => 'Trong bài học này, học viên sẽ được hệ thống hóa lại các kiến thức trọng điểm, hướng dẫn cách tránh các lỗi sai phổ biến và tăng tối đa tốc độ hoàn thành bài thi so với phương pháp cũ.',
                        'duration_minutes' => rand(30, 90),
                        'sort_order'       => $i + 1,
                    ]);
                }
            }
        }

        // Enroll students in specific courses for testing
        $students = [
            'student@beelearn.vn'   => ['grammar', 'khoa-2-tu-vung', 'khoa-3-cau'],
            'student2@beelearn.vn'  => ['ielts-foundation', 'ielts-6-5'],
            'student3@beelearn.vn'  => ['ielts-mastery', 'english-comm'],
            'student4@beelearn.vn'  => ['grammar', 'ielts-foundation', 'english-comm'],
            'student5@beelearn.vn'  => ['khoa-2-tu-vung', 'khoa-3-cau', 'ielts-6-5'],
            'student6@beelearn.vn'  => ['grammar', 'english-office'],
            'student7@beelearn.vn'  => ['ielts-foundation', 'ielts-mastery'],
            'student8@beelearn.vn'  => ['khoa-2-tu-vung', 'english-comm', 'english-office'],
            'student9@beelearn.vn'  => ['khoa-3-cau', 'ielts-6-5', 'ielts-mastery'],
            'student10@beelearn.vn' => ['grammar', 'english-comm'],
        ];

        foreach ($students as $email => $slugs) {
            $user = User::where('email', $email)->first();
            if (!$user) continue;

            $courseIds = Course::whereIn('slug', $slugs)->pluck('id');
            foreach ($courseIds as $courseId) {
                $progress = rand(10, 90);
                Enrollment::updateOrCreate(
                    ['user_id' => $user->id, 'course_id' => $courseId],
                    [
                        'progress'          => $progress,
                        'completed_lessons' => floor(($progress / 100) * 5),
                        'status'            => 'active',
                    ]
                );
            }
        }
    }
}
