package com.project.app.mapper;

import com.project.app.dto.SignUpRequest;
import com.project.app.dto.UserDto;
import com.project.app.model.User;

public class UserMapper {

    public static UserDto toUserDto(User user) {
        if (user == null) {
            return null;
        }

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setPublicId(user.getPublicId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setAvatarUrl(user.getAvatarUrl());
        userDto.setRole(user.getRole());
        userDto.setBio(user.getBio());
        userDto.setVerified(user.isVerified());
        userDto.setJoinDate(user.getJoinDate());

        return userDto;
    }

    public static User fromSignUpRequest(SignUpRequest signUpRequest) {
        if (signUpRequest == null) {
            return null;
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(signUpRequest.getPassword()); // Note: Password should be hashed in the service
        user.setRole(signUpRequest.getRole());

        return user;
    }
}
