import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f4f5fb] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-[#e65540] transition-colors mb-8">
          <ArrowLeft size={18} />
          Quay lại đăng ký
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-navy/5 rounded-2xl flex items-center justify-center">
              <FileText size={28} className="text-navy" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-navy">Điều khoản dịch vụ</h1>
              <p className="text-sm text-gray-400 mt-1">Cập nhật lần cuối: 01/01/2026</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">1. Giới thiệu</h2>
              <p className="leading-relaxed">
                Chào mừng bạn đến với BeeLearn Academy. Bằng việc truy cập và sử dụng nền tảng học tập trực tuyến của chúng tôi, 
                bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện sau đây. 
                Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">2. Tài khoản người dùng</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Bạn phải cung cấp thông tin chính xác, đầy đủ khi đăng ký tài khoản.</li>
                <li>Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động diễn ra trên tài khoản của mình.</li>
                <li>Mỗi cá nhân chỉ được sở hữu một tài khoản học viên.</li>
                <li>BeeLearn có quyền tạm khóa hoặc xóa tài khoản vi phạm điều khoản mà không cần thông báo trước.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">3. Quyền sở hữu trí tuệ</h2>
              <p className="leading-relaxed">
                Tất cả nội dung trên nền tảng BeeLearn bao gồm nhưng không giới hạn: video bài giảng, tài liệu PDF, 
                bài tập, quiz tương tác, hình ảnh và mã nguồn đều thuộc quyền sở hữu của BeeLearn Academy. 
                Nghiêm cấm sao chép, phân phối, hoặc sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn bản.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">4. Chính sách học phí & hoàn tiền</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Học phí được công bố trên website và có thể thay đổi theo từng đợt khai giảng.</li>
                <li>Học viên được hoàn tiền 100% nếu hủy đăng ký trong vòng 3 ngày kể từ ngày thanh toán và chưa tham gia buổi học nào.</li>
                <li>Sau 3 ngày hoặc đã tham gia ít nhất 1 buổi học, BeeLearn không hỗ trợ hoàn tiền.</li>
                <li>Trường hợp đặc biệt sẽ được xem xét riêng bởi bộ phận quản lý.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">5. Quy tắc ứng xử</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Tôn trọng giảng viên và các học viên khác trong mọi hoạt động trên nền tảng.</li>
                <li>Không sử dụng ngôn từ xúc phạm, phân biệt đối xử hoặc quấy rối.</li>
                <li>Không chia sẻ tài khoản cá nhân cho người khác sử dụng.</li>
                <li>Không sử dụng phần mềm gian lận trong quá trình làm bài kiểm tra.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">6. Giới hạn trách nhiệm</h2>
              <p className="leading-relaxed">
                BeeLearn nỗ lực cung cấp dịch vụ tốt nhất nhưng không đảm bảo nền tảng sẽ hoạt động liên tục 
                và không có lỗi. BeeLearn không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp hoặc gián tiếp 
                nào phát sinh từ việc sử dụng dịch vụ.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">7. Liên hệ</h2>
              <p className="leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ:
              </p>
              <div className="mt-3 p-4 bg-[#f4f5fb] rounded-2xl">
                <p className="font-bold text-navy">BeeLearn Academy</p>
                <p>📍 123 Cầu Giấy, Hà Nội</p>
                <p>📞 Hotline: 1900 6789</p>
                <p>📧 Email: contact@beelearn.edu.vn</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
