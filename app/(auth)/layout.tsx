// This layout is used to wrap the sign in and sign up pages
export default function layout({
    children,
}: {
    children: React.ReactNode
}) {
  return (
    <div className="h-full flex items-center justify-center">
        { children }
    </div>
  )
}
