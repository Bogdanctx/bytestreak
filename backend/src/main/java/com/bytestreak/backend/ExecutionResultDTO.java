package com.bytestreak.backend;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ExecutionResultDTO {
    private int statusId;
    private String statusDescription;
    private int testCaseId;
}
