import React, { useState, useEffect } from "react";
import { X, Banknote, CreditCard, Smartphone, Check, Printer } from "lucide-react";
import "./PaymentModal.css";

export default function PaymentModal({ isOpen, onClose, total, count, onConfirm }) {
    if (!isOpen) return null;

    const [step, setStep] = useState('input'); // 'input', 'processing', 'success'
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [receivedAmount, setReceivedAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");

    const receivedVal = parseFloat(receivedAmount);
    const change = (receivedVal && receivedVal > total) ? receivedVal - total : 0;

    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setReceivedAmount("");
            setTransactionId("");
            setPaymentMethod("Cash");
        }
    }, [isOpen, total]);

    const handleConfirmClick = () => {
        setStep('processing');

        setTimeout(() => {
            setStep('success');
        }, 2000);
    };

    const handleNewSale = () => {
        const details = {
            method: paymentMethod,
            amount: total,
            amountReceived: paymentMethod === "Cash" ? (parseFloat(receivedAmount) || total) : total,
            change: paymentMethod === "Cash" ? change : 0,
            transactionId: paymentMethod !== "Cash" ? transactionId : undefined
        };
        onConfirm(details);
    };

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal">

                <div className="payment-header">
                    <h2 className="payment-title">
                        {step === 'success' ? 'Payment Complete' : 'Complete Payment'}
                    </h2>
                    {step === 'input' && (
                        <button onClick={onClose} className="close-btn">
                            <X size={20} />
                        </button>
                    )}
                    {step === 'success' && (
                        <button onClick={handleNewSale} className="close-btn">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {step !== 'success' ? (
                    <>

                        <div className="amount-display">
                            <p className="amount-label">Amount to Pay</p>
                            <div className="amount-value">
                                ₹{total?.toFixed(2) || "0.00"}
                            </div>
                            <p className="item-count">{count} items</p>
                        </div>


                        <div>
                            <p className="section-label">Payment Method</p>
                            <div className="payment-methods">
                                {[
                                    { id: "Cash", icon: Banknote, label: "Cash" },
                                    { id: "Card", icon: CreditCard, label: "Card" },
                                    { id: "UPI", icon: Smartphone, label: "UPI" }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`method-btn ${paymentMethod === method.id ? "active" : ""}`}
                                        disabled={step === 'processing'}
                                    >
                                        <method.icon className="method-icon" size={24} />
                                        <span className="method-label">{method.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>


                        <div className="input-section">
                            {paymentMethod === "Cash" ? (
                                <>
                                    <label className="section-label" style={{ display: 'block', marginBottom: '8px' }}>
                                        Amount Received
                                    </label>
                                    <div className="amount-input-wrapper">
                                        <input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={receivedAmount}
                                            onChange={(e) => setReceivedAmount(e.target.value)}
                                            className="amount-input"
                                            autoFocus
                                            disabled={step === 'processing'}
                                        />
                                    </div>


                                    <div className="quick-keys">
                                        {[
                                            Math.ceil(total / 10) * 10 + 10,
                                            Math.ceil(total / 10) * 10 + 40,
                                            200,
                                            500
                                        ]
                                            .map(amt => amt < total ? amt + 100 : amt)
                                            .sort((a, b) => a - b)
                                            .slice(0, 4)
                                            .map((amt) => (
                                                <button
                                                    key={amt}
                                                    onClick={() => setReceivedAmount(amt.toString())}
                                                    className="quick-key-btn"
                                                    disabled={step === 'processing'}
                                                >
                                                    ₹{amt}
                                                </button>
                                            ))}
                                    </div>


                                    {change > 0 && (
                                        <div className="change-display">
                                            <span className="change-label">Change</span>
                                            <span className="change-value">₹{change.toFixed(2)}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <label className="section-label" style={{ display: 'block', marginBottom: '8px' }}>
                                        Reference Number (Optional)
                                    </label>
                                    <div className="amount-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Transaction reference"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            className="amount-input transaction-input"
                                            autoFocus
                                            disabled={step === 'processing'}
                                        />
                                    </div>
                                </>
                            )}
                        </div>


                        <div className="payment-modal-actions">
                            <button
                                onClick={onClose}
                                className="payment-action-btn payment-btn-cancel"
                                disabled={step === 'processing'}
                            >
                                <X size={18} className="btn-icon" />
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmClick}
                                className="payment-action-btn payment-btn-confirm"
                                disabled={step === 'processing'}
                            >
                                {step === 'processing' ? 'Processing...' : (
                                    <>
                                        <Check size={18} className="btn-icon" />
                                        Confirm
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="success-view">
                        <div className="success-icon-wrapper">
                            <Check className="success-icon" size={40} strokeWidth={3} />
                        </div>

                        <div className="success-amount">
                            ₹{total?.toFixed(2)}
                        </div>

                        <p className="success-method">
                            Paid via {paymentMethod.toUpperCase()}
                        </p>

                        {paymentMethod === "Cash" && change > 0 && (
                            <p className="success-change">
                                Change: ₹{change.toFixed(2)}
                            </p>
                        )}

                        <div className="payment-modal-actions" style={{ width: '100%', marginTop: '20px' }}>
                            <button className="payment-action-btn payment-btn-cancel">
                                <Printer size={18} className="btn-icon" />
                                Print Invoice
                            </button>
                            <button onClick={handleNewSale} className="payment-action-btn payment-btn-confirm">
                                New Sale
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
