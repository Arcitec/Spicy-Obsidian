// SPDX-License-Identifier: GPL-3.0-or-later
/*
 * Copyright 2022 Bananaman (https://github.com/Bananaman/Spicy-Obsidian)
 */


// Parameters.
const folder = input.folder;  // "str"
const search = input.search;  // ["#tag", "#tag"]
const show_headers = input.show_headers ?? true;  // bool
const msg_no_tasks = input.msg_no_tasks ?? "No tasks.";  // "str"
const parallel_keyword = input.parallel_keyword ?? "parallel";  // "str"
const result_cb = input.result_cb ?? ((next_tasks, show_headers) => dv.taskList(next_tasks, show_headers));  // function.

if (folder === undefined || search === undefined) {
    dv.el("b", "Missing required parameters.");
    return;
}

if (typeof folder !== "string" || folder.indexOf('"') !== -1) {
    dv.el("b", "Invalid \"folder\" parameter. Must be a string and cannot contain any double-quotes (\") in the folder name.");
    return;
}

if (!Array.isArray(search) || search.length < 1) {
    dv.el("b", "Invalid \"search\" parameter. Must be a non-empty array.");
    return;
}


// Search algorithm.
const next_tasks = [];
const regex_escape = (s) => String(s).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
const search_re = search.map(s => new RegExp("^" + regex_escape(s) + "(?:\\/|$)"));
const is_parallel_re = new RegExp("^" + regex_escape(parallel_keyword) + " ", "i");  // Case-insensitive.
dv.pages('"' + folder + '" and ' + search.join(" and ")).forEach(p => {
    // Process all tasks in the current file to check if they match.
    // NOTE: `dv.pages()` quickly looked up all potential pages that contain
    // all of the tags on ANY of their lines, and now we'll narrow it down
    // to the exact tasks that contain all of the given tags.
    // NOTE: Tags are always case-sensitive.
    const seen_sections = new Map();
    p.file.tasks.forEach(t => {
        // Instantly skip completed tasks. This speedup also helps us avoid
        // doing work for old projects which only consist of completed tasks.
        if (t.completed) return;
        
        // Analyze the section (header) that the task belongs to.
        // NOTE: The `subpath` is the `# Header` that the task list is under,
        // or `undefined` if there isn't any header above the list. However,
        // the `Map()` is able to handle the `undefined` value correctly.
        const subpath = t.section.subpath;
        let first_encounter = false;
        let is_parallel = seen_sections.get(t.section.subpath);
        if (is_parallel === undefined) {
            // It's the first time we encounter this section header.
            first_encounter = true;
            
            // Determine whether this header starts with `Parallel `.
            // NOTE: The search is case-insensitive, and looks at the `subpath`
            // version of the header text (which removes special characters).
            // NOTE: We created the regex in non-Unicode mode, since Unicode
            // matching is extremely slow (since it must parse individual chars
            // out of the multi-byte sequences). However, we actually partially
            // support scanning for Unicode characters (incl. emojis), since our
            // regex simply treats them as multiple 8-bit chars, but means that
            // it will ONLY be case-insensitive for the English alphabet (a-z).
            is_parallel = subpath !== undefined ? is_parallel_re.test(subpath) : false;
            seen_sections.set(subpath, is_parallel);
        }
        
        // Sequential: Only process the first incomplete task of each section.
        if (!is_parallel && !first_encounter) return; 
        
        // Only add this task if it contains all search-tags.
        // NOTE: Supports nested tags, so "#foo" matches "#foo/bar",
        // and it properly parses tags, so "#foo" won't match "#foos".
        if (search_re.every(re => t.tags.some(v => re.test(v)))) {
            next_tasks.push(t);
        }
    });
});


// Results.
if (next_tasks.length > 0) {
    result_cb(next_tasks, show_headers);
} else {
    dv.el("b", msg_no_tasks);
}
