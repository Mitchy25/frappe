import Quill from "quill";
import Mention from "./quill-mention/quill.mention";

Quill.register("modules/mention", Mention, true);

frappe.ui.form.ControlComment = class ControlComment extends frappe.ui.form.ControlTextEditor {
	make_wrapper() {
		this.comment_wrapper = !this.no_wrapper
			? $(`
			<div class="comment-input-wrapper">
				<div class="comment-input-header">
					<span>${__("Add a comment")}</span>
				</div>
				<div class="comment-input-container">
					<div class="frappe-control"></div>
					<div class="text-muted small">
						${__("Ctrl+Enter to add comment")}
					</div>
				</div>
				<button class="btn btn-default btn-comment btn-xs">
					${__("Comment")}
				</button>
				${cur_frm && cur_frm.doc.doctype == "Sales Invoice" ? `
				<div class="checkbox">
                	<label style="margin-top: 1%;">
                        <span class="input-area">
							<input type="checkbox" autocomplete="off" class="input-with-feedback" id="notifyOnLoadCheckbox">
						</span>
						<span class="disp-area" style="display: none;">
							<input type="checkbox" disabled="" class="disabled-selected">
						</span>
                        <span class="label-area">Notify On Load</span>
                    </label>
                    <p class="help-box small text-muted"></p>
                </div>`  : ''}
			</div>
		`)
			: $('<div class="frappe-control"></div>');

		this.comment_wrapper.appendTo(this.parent);

		// wrapper should point to frappe-control
		this.$wrapper = !this.no_wrapper
			? this.comment_wrapper.find(".frappe-control")
			: this.comment_wrapper;

		this.wrapper = this.$wrapper;

		this.button = this.comment_wrapper.find(".btn-comment");
	}

	bind_events() {
		super.bind_events();

		this.button.click(() => {
			this.submit();
		});

		this.$wrapper.on("keydown", (e) => {
			const key = frappe.ui.keys.get_key(e);
			if (key === "ctrl+enter") {
				e.preventDefault();
				this.submit();
			}
		});

		this.quill.on(
			"text-change",
			frappe.utils.debounce(() => {
				this.update_state();
			}, 300)
		);
	}

	submit() {
		var notifyOnLoad = false;
		const notifyCheckbox = this.comment_wrapper.find('.input-with-feedback#notifyOnLoadCheckbox');
		if (notifyCheckbox && notifyCheckbox.prop(('checked'))) {
			notifyOnLoad = 1;
		} else {
			notifyOnLoad = 0;
		}
		this.on_submit && this.on_submit(this.get_value(), notifyOnLoad);
	}

	update_state() {
		const value = this.get_value();
		if (strip_html(value).trim() != "" || value.includes("img")) {
			this.button.removeClass("btn-default").addClass("btn-primary");
		} else {
			this.button.addClass("btn-default").removeClass("btn-primary");
		}
	}

	get_quill_options() {
		const options = super.get_quill_options();
		return Object.assign(options, {
			theme: "bubble",
			bounds: this.quill_container[0],
		});
	}

	get_toolbar_options() {
		return [
			["bold", "italic", "underline", "strike"],
			["blockquote", "code-block"],
			[{ direction: "rtl" }],
			["link", "image"],
			[{ list: "ordered" }, { list: "bullet" }],
			[{ align: [] }],
			["clean"],
		];
	}

	clear() {
		this.quill.setText("");
	}

	disable() {
		this.quill.disable();
		this.button.prop("disabled", true);
	}

	enable() {
		this.quill.enable();
		this.button.prop("disabled", false);
	}
};
