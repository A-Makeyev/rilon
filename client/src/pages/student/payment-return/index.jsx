import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { capturePaymentAndFinalizeOrder } from "@/services"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import ConfettiExplosion from "react-confetti-explosion"
import { PartyPopper } from "lucide-react"


function PaymentReturnPage() {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const paymentId = params.get('paymentId')
    const payerId = params.get('PayerID')
    const [displayConfetti, setDisplayConfetti] = useState(false)

    useEffect(() => {
        if (paymentId && payerId) {
            async function capturePayment() {
                const orderId = JSON.parse(sessionStorage.getItem('orderId')) 
                const response = await capturePaymentAndFinalizeOrder(
                    paymentId,
                    payerId,
                    orderId
                )

                if (response?.success) {
                    sessionStorage.removeItem('orderId')
                    setTimeout(() => { setDisplayConfetti(true)}, 1000)
                    setTimeout(() => { window.location.href = '/acquired-courses'}, 3500)    
                }
            }
            capturePayment()
            if (displayConfetti) {
                setTimeout(() => setDisplayConfetti(false), 3000)
            }
        }
    }, [paymentId, payerId, displayConfetti])
    
    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-background">
            <Card className="flex justify-around items-center mt-5 p-2">
                <CardHeader>
                    <CardTitle className="text-lg text-gray-700 font-mono">
                        { displayConfetti ? (
                            <div className="flex flex-row">
                                Happy Learning!
                                <PartyPopper className="w-5 h-5 mt-1 ml-3" />
                                <ConfettiExplosion
                                    force={1} 
                                    width={3000} 
                                    duration={3000} 
                                    particleCount={300} 
                                />
                            </div>
                    ) : (
                        <div className="flex flex-row">
                            <LoadingSpinner className="w-5 h-5 mt-1 mr-3" />
                            Processing Payment..
                        </div>
                    )}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}

export default PaymentReturnPage