import Header from "./Header"

const CommonLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Header></Header>
        {children}
    </div>
  )
}

export default CommonLayout