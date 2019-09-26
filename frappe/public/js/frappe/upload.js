// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

//import FileUploader from './file_uploader/index.js';

const FileUploader = require('./file_uploader/index.js').default

frappe.provide('frappe.ui');
frappe.ui.FileUploader = FileUploader;
