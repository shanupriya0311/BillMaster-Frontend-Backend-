package com.billmaster.user.service;

import java.util.List;

import com.billmaster.user.entity.Customer;

public interface CustomerService {

    Customer addCustomer(Customer customer);

    List<Customer> getAllCustomers();

   Customer getCustomerByPhone(String phone);

    Customer updateCustomerByPhone(String phone, Customer customer);

    void deleteCustomerByPhone(String phone);
}
