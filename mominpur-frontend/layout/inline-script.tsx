// সার্ভারে `text/javascript` — HTML পার্স হওয়ার সময়ই চলে, প্রথম পেইন্টের আগে।
// ক্লায়েন্টে `text/plain` — সফট নেভিগেশনে আবার চলে না (এবং React-এর ডেভ ওয়ার্নিং এড়ায়)।
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
