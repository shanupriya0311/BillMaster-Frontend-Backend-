package com.billmaster.user.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.billmaster.user.entity.Customer;
import com.billmaster.user.service.CustomerService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        return customerService.addCustomer(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }
   @GetMapping("/phone/{phone}")
    public Customer getByPhone(@PathVariable String phone) {
        return customerService.getCustomerByPhone(phone);
    }

@PutMapping("/phone/{phone}")
    public Customer updateByPhone(@PathVariable String phone,
                                  @RequestBody Customer customer) {
        return customerService.updateCustomerByPhone(phone, customer);
    }
    
 @DeleteMapping("/phone/{phone}")
    public String deleteByPhone(@PathVariable String phone) {
        customerService.deleteCustomerByPhone(phone);
        return "Customer deleted successfully";
    }
 
}
