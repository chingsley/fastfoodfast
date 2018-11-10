
const emailTest = {
    // Return true is an email ends with '.com', else return false
    dotCom(email) {
        const i = email.lastIndexOf('@');
        const dom = email.slice(i + 1);
        let d = dom.lastIndexOf('.com');
        if (dom[d + 4] === undefined) {
            return true;
        } else {
            return false;
        }
    },

    // Return true is an email ends with '.org', else return false
    dotOrg(email) {
        const i = email.lastIndexOf('@');
        const dom = email.slice(i + 1);
        let d = dom.lastIndexOf('.org');
        if (dom[d + 4] === undefined) {
            return true;
        } else {
            return false;
        }
    },

    // Return true is an email ends with '.org', else return false
    dotNet(email) {
        const i = email.lastIndexOf('@');
        const dom = email.slice(i + 1);
        let d = dom.lastIndexOf('.net');
        if (dom[d + 4] === undefined) {
            return true;
        } else {
            return false;
        }
    },

    // Return false if the domain name contains an invalid character
    isValidDomChar(char, dom) {
        if ((char.codePointAt(0) >= 65 && char.codePointAt(0) <= 90)) {
            return true;
        }
        if ((char.codePointAt(0) >= 97 && char.codePointAt(0) <= 122)) {
            return true;
        }
        if ((char === '-' && dom.indexOf(char) != 0)) {
            return true;
        }
        if (char === '.') {
            return true;
        }
        if (!isNaN(Number(char))) {
            return true;
        }

        return false;
    },

    // format of email address is [ local-part@domain ]
    /**
     * Method to verify the email
     * @param {string} email to be verified (var str),  
     * @returns {object} an object with two properties
     *        error: true for invalid email, and false for valid email
     *        message: contains info about the email or the error 
     */

    verifyEmail(str) {
        let msg = '';

        // If mail does not contain '@' return error
        if (str.indexOf('@') < 0) {
            msg = `email is missing the '@' character`;
            return { error: true, message: msg };
        }
        console.log(str);
        let quoted = false;
        const i = str.lastIndexOf('@');
        const dom = str.slice(i + 1);
        const domArr = dom.split('');
        const lp = str.slice(0, i);
        const lpArr = lp.split('');
        const specialChars = `"^'(),:;<>@[\\]`.split('');

        // To determine whether the local-part of email is quoted (in double quotation marks)
        if (lp[0] === `"` && lp[lp.length - 1] === `"`) {
            quoted = true;
        }

        if (lp.length < 1) {
            msg = `your email is missing the username part. Format: [username]@[domain]`;
            return { error: true, message: msg };
        }

        if (dom.length < 1) {
            msg = `your email is missing the domain part. Format: [username]@[domain]`;
            return { error: true, message: msg };
        }

        if (lp.length > 64) {
            msg = `the username part of your email cannot contain more than 64 characters`;
            return { error: true, message: msg };
        }



        if (dom.length > 255) {
            msg = `the domain part of your email cannot contain more than 255 characters`;
            return { error: true, message: msg };
        }

        // local-part cannot start or end with a dot
        if (lpArr[0] === '.' || lpArr[lpArr.length - 1] === '.') {
            msg = `a dot (.) cannot start or end username part of your email, the username is unless quoted`;
            return { error: true, message: msg };
        }

        // email (local-part) name should not contain consecutive dots
        let x = -1;
        for (let i = 0; i < lp.length; i++) {
            x = lp.indexOf('.', x + 1); // starts from index 0, and finds the next instance of '.' with every loop
            // console.log(x);
            let y = x + 1; // n is index of the next character following the current dot
            if (lp[x] === lp[y]) {
                msg = `email: consecutive dots are not allowed, unless the username is quoted`;
                return { error: true, message: msg };
            }
        }

        // cannot contain more than one @ without quotes
        if ((lp.indexOf('@') > -1) && !quoted) {
            msg = `email: only one @ is allowed outside quotation marks`;
            return { error: true, message: msg };
        }

        // cannot contain a space without quotes
        if ((lp.indexOf(' ') > -1) && !quoted) {
            msg = `email username cannot contain spaces, unless the username is quoted`;
            return { error: true, message: msg };
        }

        // cannot contain some special chars like "(),:;<>@[\\] without qoutes
        for (let i = 0; i < specialChars.length; i++) {
            if ((lp.indexOf(specialChars[i]) > -1) && !quoted) {
                msg = `email cannot contain '${specialChars[i]}' outside quotation marks`;
                return { error: true, message: msg };
            }
        }

        // Should not contain line formatting characters like \n.
        // Recall: Line formatting characters fall within the range
        // of character codes from 0 to 32
        for (let i = 0; i < 32; i++) {
            if ((lp.indexOf(String.fromCodePoint(i)) > -1)) {
                msg = `email cannot contain line formatting characters like \\n, \\t, etc`;
                return { error: true, message: msg };
            }
        }

        // Domain name should not contain consecutive dots
        let m = -1;
        for (let i = 0; i < dom.length; i++) {
            m = dom.indexOf('.', m + 1); // starts from index 0, and finds the next instance of '.' with every loop
            let n = m + 1; // n is index of the next character following the current dot
            if (domArr[m] === domArr[n]) {
                msg = `email: consecutive dots after @ is not allowed.`;
                return { error: true, message: msg };
            }
        }

        // domain name connot contain spaces
        if ((dom.indexOf(' ') > -1)) {
            msg = `email cannot contain spaces after @`;
            return { error: true, message: msg };
        }
        // domain should end with .com, .org, .net, ...
        if (!this.dotCom(str) && !this.dotOrg(str) && !this.dotNet(str)) {
            msg = `email domain name must end with '.com', '.org' or '.net'`;
            return { error: true, message: msg };
        }

        // leading dash in front of domain is invalid
        if (dom[0] === '-') {
            msg = `email: leading dash in front of domain is not allowed`;
            return { error: true, message: msg }
        }

        // Rejects special characters in the domain name except '.' and non-leading dash (-)
        for (let i = 0; i < dom.length; i++) {
            if (!this.isValidDomChar(dom[i], dom)) {
                msg = `email: special characters like " ${dom[i]} " is not allowed in the domain`;
                return { error: true, message: msg };
            }
        }

        // Return false if there is no dot in the domain (there must be a .*)
        if (dom.indexOf('.') < 0) {
            msg = `your email has an invalid domain name. Use .com, .org, or .net`;
            return { error: true, message: msg };
        }

        // If an email passes all the tests above, then return this:
        return { error: false, message: 'email is valid' };

    }
}

export default emailTest;