import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { capturePaymentAndFinalizeOrder } from "@/services"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"


function PaymentReturnPage() {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const paymentId = params.get('paymentId')
    const payerId = params.get('PayerID')

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
                    window.location.href = '/acquired-courses'
                }
            }
            capturePayment()
        }
    }, [paymentId, payerId])
    
    return (
        <div className="flex items-center justify-center min-h-[50vh] bg-background">
            <Card className="flex justify-around items-center mt-5 p-5">
                <CardHeader>
                    <CardTitle className="flex flex-row gap-3 text-lg text-gray-700 font-mono">
                        <LoadingSpinner className="w-5 h-5 mt-1" />
                        Processing payment
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}

export default PaymentReturnPage