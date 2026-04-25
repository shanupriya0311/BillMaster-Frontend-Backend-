package com.billmaster.user.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.billmaster.user.entity.Customer;
import com.billmaster.user.repository.CustomerRepository;
import com.billmaster.user.service.CustomerService;
import com.billmaster.user.exception.CustomerNotFoundException;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

  @Override
    public Customer getCustomerByPhone(String phone) {
        return customerRepository.findByPhone(phone)
            .orElseThrow(() ->
                new CustomerNotFoundException("Customer not found with phone: " + phone));
    }


      @Override
    public Customer updateCustomerByPhone(String phone, Customer updated) {

        Customer existing = customerRepository.findByPhone(phone)
            .orElseThrow(() ->
                new CustomerNotFoundException("Customer not found with phone: " + phone));

        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setAddress(updated.getAddress());

        return customerRepository.save(existing);
    }
      @Override
    public void deleteCustomerByPhone(String phone) {

        if (!customerRepository.existsByPhone(phone)) {
            throw new CustomerNotFoundException("Customer not found with phone: " + phone);
        }

        customerRepository.deleteByPhone(phone);
    }
}
