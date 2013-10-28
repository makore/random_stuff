<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
    <title>Spring MVC @ExceptionHandler Example</title>
</head>
<body>
    <h2>Spring MVC @ExceptionHandler Example</h2>
    <c:if test="${not empty errMsg}">
        <h4>${errMsg}</h4>
    </c:if>
</body>
</html>
