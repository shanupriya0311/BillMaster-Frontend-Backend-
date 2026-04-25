package com.billmaster.user.repository;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.billmaster.user.entity.Customer;

public interface CustomerRepository extends MongoRepository<Customer, String> {
     Optional<Customer> findByPhone(String phone);

    void deleteByPhone(String phone);

    boolean existsByPhone(String phone);
}
