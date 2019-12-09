// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: See license.txt

frappe.ui.form.on('Currency', {
	refresh(frm) {
		frm.set_intro("");
		if(!frm.doc.enabled) {
			frm.set_intro(__("This Currency is disabled. Enable to use in transactions"));
		}
	},

	after_save(frm) {
		if (frm.doc.enabled)
			locals[':Currency'][frm.doc.name] = Object.assign(frm.doc, { doctype: ':Currency' });
	}
});
