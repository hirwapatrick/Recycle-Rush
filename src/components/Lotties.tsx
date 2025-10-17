//Lottie.tsx
import Lottie from "lottie-react"
type headerProps ={
    animationData : {}
}
function Lotties({animationData}:headerProps) {
  return (
    <div>
        <Lottie  animationData={animationData} className={`w-[200px] h-[200px]`}  loop={true} />
    </div>
  )
}
export default Lotties