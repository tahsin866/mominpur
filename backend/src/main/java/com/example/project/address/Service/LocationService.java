package com.example.project.address.Service;

import com.example.project.address.Model.Division;
import com.example.project.address.Repository.DivisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class LocationService {
    
    @Autowired
    private DivisionRepository divisionRepository;

    @Transactional(readOnly = true)
    public List<Division> getAllDivisionsWithDetails() {
        return divisionRepository.findAll();
    }
}
