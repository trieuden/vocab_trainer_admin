# Admin Frontend Agent Rules (`vocab_trainer_admin`)

Mọi Agent và Developer khi làm việc trên dự án Admin Frontend Next.js phải tuân thủ nghiêm ngặt các quy tắc sau:

1. **Cấu trúc dự án**:
   - Trang chính: `libs/vocab/pages/<domain>/`
   - Component chung: `libs/core/components/`
   - Connector API: `libs/core/api/<domain>/`
   - Layout: `libs/vocab/layout/`

2. **Key Translate (i18n)**:
   - Toàn bộ văn bản giao diện (nhãn, nút, tiêu đề, toast message) phải dùng key `i18n` qua `useTranslation`. Không hardcode text trong JSX.

3. **Hạn chế tối đa `any`**:
   - Nghiêm cấm dùng kiểu `any`. Mọi state, props, response data phải có type/interface rõ ràng.

4. **Nơi để logic call API**:
   - Mọi hàm gọi API phải đặt tại `libs/core/api/<domain>/index.ts` và sử dụng connector `vocabApiClient`. Không gọi API trực tiếp trong UI components/pages.

5. **Nơi để Type & Interface**:
   - DTOs / API types: Đặt tại `libs/core/api/<domain>/dtos/` hoặc `libs/core/api/<domain>/index.ts`.
   - Component props/types: Đặt tại file component hoặc `component.types.ts` cùng cấp.

6. **Cấu trúc Component / Hook / Index**:
   - Trang chính: `index.tsx`
   - Sub-components: `components/`
   - Custom Hooks: `hooks/`
   - Re-export sạch sẽ qua file `index.ts` / `index.tsx`.
