<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<html>
<head>
    <title>Create a free User account</title>
</head>
<body>
<!-- Bind form to model attribute -->
<sf:form method="POST" modelAttribute="user">
    <fieldset>
        <table cellspacing="0">
            <tr>
                <th><label for="user_name">User name:</label></th>
                <td>
                    <sf:input path="name" size="15" maxlength="15" id="user_name"/>
                    <sf:errors path="name" cssClass="error"/>
                    <small id="username_msg">No spaces, please.</small>
                </td>
            </tr>
            <tr>
                <th><label for="email">Email address:</label></th>
                <td>
                    <sf:input path="email" size="30" id="email"/>
                    <small>In case you forget something</small>
                </td>
            </tr>
        </table>
    </fieldset>
</sf:form>
</body>
</html>
