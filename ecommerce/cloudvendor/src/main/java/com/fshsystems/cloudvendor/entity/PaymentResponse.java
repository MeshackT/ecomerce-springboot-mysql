package com.fshsystems.cloudvendor.entity;

import java.util.List;
import java.util.Map;

public class PaymentRequest {
    private double amount;
    private String currency;
    private List<Map<String, Object>> items;

    // Getters and setters
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public List<Map<String, Object>> getItems() { return items; }
    public void setItems(List<Map<String, Object>> items) { this.items = items; }
}