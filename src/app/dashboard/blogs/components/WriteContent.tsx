"use client";
import { UPLOAD_URL, stringToBoolean, toastStyles, uploadImage } from "@/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useQuill } from "react-quilljs";

type uploadResType = { upload: true; id: string } | { upload: false };

// get button format info
function getButtonFormatInfo(button: HTMLElement) {
  const buttonState = button.dataset.active as "true" | "false" | undefined;

  const buttonFormat = button.dataset.format as string;
  const buttonValue = button.dataset.value as string;
  return { buttonState, buttonFormat, buttonValue };
}
// when cursor in text than get the parent of that text and see if the parent is wrapper tag and return that wrapper tag only
function getTargetElement(targetElement: HTMLElement) {
  while (!targetElement.tagName.match(/^(P|LI|H1|H2|H3|H4|H5|H6|UL|OL|BLOCKQUOTE)$/i)) {
    targetElement = targetElement.parentElement as HTMLElement;
  }
  return targetElement;
}
// function to apply formate and close list when an item in list is clicked and remove active for all items
function setFormat(formatFunction: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void, event: React.MouseEvent<HTMLLIElement, MouseEvent>, withACtive: boolean = true) {
  // if with active that mean that list show have one item active so we need to inactive all other items and the formateFn will add the active to the target item
  if (withACtive) {
    const parentElement = event.currentTarget.parentElement;
    parentElement?.querySelectorAll("li").forEach((li) => {
      li.classList.remove("bg-blue-100");
      li.dataset.active = "false";
    });
  }
  formatFunction(event);
}
// toggle close and open list of formate items with simple effects;
function openCloseList(list: Element, open: boolean) {
  if (open) {
    // open list
    setTimeout(() => {
      list.classList.remove("bottom-0", "opacity-0");
      list.classList.add("bottom-[calc(100%_+_.5rem)]", "opacity-1");
    }, 50);
    list.classList.remove("hidden");
    // set data active to the icon formate (prev sibling of the list) to use that value to indicate open/close the list after that.
    list.previousElementSibling?.setAttribute("data-active", "true");
  } else {
    // close list
    list.classList.remove("bottom-[calc(100%_+_.5rem)]", "opacity-1");
    list.classList.add("bottom-0", "opacity-0");
    setTimeout(() => {
      list.classList.add("hidden");
    }, 200);
    //
    list.previousElementSibling?.setAttribute("data-active", "false");
  }
}

export default function WriteContent({ uploadImagesSession }: { uploadImagesSession: { init: boolean; sessionID: string } | undefined }) {
  const { editor, editorRef, Quill } = useQuill({
    theme: "snow",
    modules: {
      toolbar: null,
    },
    formats: ["bold", "italic", "underline", "strike", "align", "list", "indent", "size", "header", "link", "image", "video", "color", "background", "font", "clean"],
    placeholder: "what's in your mind?",
  });
  const [openedList, setOpenedList] = useState<Element | null>(null);
  const [resizedImage, setImageToResize] = useState<HTMLImageElement | null>(null);

  const resizeOptions = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editor || !editorRef) return;

    editor.on("editor-change", () => {
      openedList && openCloseList(openedList, false);
    });
    // imports fonts and set default font
    const FontAttributor = Quill.import("attributors/class/font");
    FontAttributor.whitelist = ["ibm_plex_sans", "fredoka_brando", "ubuntu_mono", "sofia", "Josefin_slab"];
    Quill.register(FontAttributor, true);
    (editorRef.current as HTMLElement).querySelector(".ql-editor")?.classList.add("ql-font-ibm_plex_sans", "custom-scroll-bar");
  }, [editor, openedList]);

  // formate text
  function QEditor_format(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const { buttonState, buttonFormat, buttonValue } = getButtonFormatInfo(e.currentTarget);
    const buttonStateBoolean = stringToBoolean(buttonState);

    if (editor) {
      //if button with active state than check if true or false to toggle active styles
      if (buttonState) {
        e.currentTarget.dataset.active = `${!buttonStateBoolean}`;
        if (!buttonStateBoolean) {
          e.currentTarget.classList.add("bg-blue-100");
        } else {
          e.currentTarget.classList.remove("bg-blue-100");
        }
      }

      // focus on editor and toggle the text formate
      editor.format(buttonFormat, buttonValue ? buttonValue : !buttonStateBoolean);
      editor.focus();
    }
  }

  // headers list toggle
  function QEditor_formats_list_toggle(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    const listState = e.currentTarget.dataset.active as "true" | "false";
    const listStateBoolean = stringToBoolean(listState);
    const targetList = e.currentTarget.nextElementSibling;
    if (!targetList) return;

    // if there is an list  already opened we need to close it to make only one list opened
    // if the already opened list  not equal the target list (its not the same list) so we need to
    if (openedList !== targetList) {
      // close already opened list
      openedList && openCloseList(openedList, false);
      // update the opened list with the new opened list (target)
      setOpenedList(targetList);
    }

    openCloseList(targetList, !listStateBoolean);
  }

  // headers handler
  function QEditor_header(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    setFormat(QEditor_format, e, false); // set format  without any active item at list
    openCloseList(openedList!, false); // close list
  }

  // font handler
  function setFont(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    setFormat(QEditor_format, e, true); // set format  with an active item at list
    openCloseList(openedList!, false); // close list
  }

  // size handler
  function QEditor_size(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    if (e.currentTarget.dataset.value == undefined) {
      e.currentTarget.parentElement?.querySelectorAll("li").forEach((li) => {
        li.classList.remove("bg-blue-100");
      });
      e.currentTarget.classList.add("bg-blue-100");
      editor?.format("size", false);
      editor?.focus();
      openCloseList(openedList!, false);
    } else {
      setFormat(QEditor_format, e, true);
    }
  }

  // switch the dir form rtl/ltr
  function QEditor_dir(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const { buttonState } = getButtonFormatInfo(e.currentTarget);
    if (editor) {
      e.currentTarget.dataset.active = `${!stringToBoolean(buttonState)}`;
      e.currentTarget.classList.toggle("bg-blue-100");
      editor.focus();
      let targetElement: HTMLElement | null = null;
      const selection = window.getSelection();
      // if cursor position is on textNode than call getTargetElement to get ElementNode (wrapper only)
      if (selection?.focusNode?.nodeName == "#text") {
        targetElement = getTargetElement(selection.focusNode.parentElement as HTMLElement);
      } else {
        targetElement = selection?.focusNode as HTMLElement;
      }

      // if the button active switch to rtl else reset to default
      if (!stringToBoolean(buttonState)) {
        targetElement.setAttribute("style", "direction:rtl;");
      } else {
        targetElement.removeAttribute("style");
      }
    }
  }

  // set align
  function QEditor_align(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    if (e.currentTarget.dataset.value == undefined) {
      e.currentTarget.parentElement?.querySelectorAll("li").forEach((li) => {
        li.classList.remove("bg-blue-100");
      });
      e.currentTarget.classList.add("bg-blue-100");
      editor?.format("align", false);
      editor?.focus();
      openCloseList(openedList!, false);
    } else {
      setFormat(QEditor_format, e, true);
    }
  }

  // u/o list  handler
  function list_handler(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    if (e.currentTarget.dataset.active == "true") {
      if (editor) {
        editor.focus();
        editor.format("list", false);
        e.currentTarget.classList.remove("bg-blue-100");
        e.currentTarget.dataset.active = "false";
      }
    } else {
      QEditor_format(e);
    }
  }

  // insert image handler
  function insertImageHandler(e: React.FormEvent<HTMLInputElement>) {
    const alert = toast;

    if (!uploadImagesSession) {
      alert.error("there is a problem with images manager, refresh page and try again", { style: toastStyles });
      console.error("images server doesn't response, we cant upload images right now ");
      return;
    }
    if (!e.currentTarget.files?.length) return;

    const file = e.currentTarget.files[0];
    const imageId = new Date().getTime();
    const imageName = file.name;

    alert.loading("uploading...", { style: toastStyles });

    uploadImage(file, `${imageId}`, uploadImagesSession.sessionID, "blog", uploadCallback);

    function uploadCallback(err: string | null, res: uploadResType) {
      alert.remove();
      if (!res.upload) {
        alert.error("something went wrong!", { style: toastStyles });
        console.log(err);
        return;
      }
      alert.success("done!", { style: toastStyles });
      const imageUrl = `${UPLOAD_URL}/images/blog/upat_${imageId}_${imageName}`;
      if (editor) {
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", imageUrl);
        editor.setSelection(range.index + 1, range.length);
        const selection = window.getSelection();
        const imageContainer = selection?.focusNode as HTMLElement;
        const insertedImage = imageContainer.firstElementChild as HTMLImageElement;
        imageContainer.classList.add("flex");
        insertedImage.classList.add("border", "w-1/2", "h-auto", "rounded", "cursor-pointer");

        insertedImage.addEventListener("click", openResizeOptions);
      }
    }
  }

  // link handler
  function link_handler() {
    function ensureHttps(url: string) {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url;
      }
      return url;
    }

    if (editor) {
      const url = prompt("insert url", "www.google.com");
      if (url && url.trim().length > 0) {
        editor.focus();
        editor.format("link", ensureHttps(url));
      }
    }
  }
  // colors handler
  function colors_handler(e: React.FocusEvent<HTMLInputElement, Element>) {
    if (editor) {
      editor.focus();
      editor.format(e.currentTarget.dataset.format as string, e.currentTarget.value);
    }
  }

  // change image width and position
  function openResizeOptions(this: HTMLImageElement) {
    const imageContainer = this.parentElement;
    if (imageContainer && this !== resizedImage) {
      setImageToResize(this);
    }
    if (resizeOptions.current) {
      resizeOptions.current.classList.remove("hidden");
    }
  }
  function setImageWidth(e: React.FormEvent<HTMLInputElement>) {
    if (resizedImage) {
      resizedImage.style.width = e.currentTarget.value + "%";
    }
  }
  function setImagePosition(e: React.ChangeEvent<HTMLSelectElement>) {
    if (resizedImage) {
      resizedImage.style.margin = "unset";
      if (e.currentTarget.value == "center") {
        resizedImage.style.cssText = `margin: auto`;
      } else {
        resizedImage.style.cssText = `margin-${e.currentTarget.value}: auto`;
      }
    }
  }
  function closeResizeOptions() {
    if (resizeOptions.current) {
      resizeOptions.current.classList.add("hidden");
    }
  }

  return (
    <div className='bg-white min-h-96 rounded relative'>
      <div ref={editorRef} style={{ height: "calc(100vh - 8.5rem)" }} className='quill-editor' />
      <div className='toolbar-container absolute -bottom-3 left-0 right-0 flex justify-center items-end'>
        <div id='toolbar-container' className='tool_bar flex gap-x-3 gap-y-[2px] bg-slate-100  w-4/5  shadow-md rounded max-w-[455px] px-2 py-1  flex-wrap-reverse justify-evenly'>
          <ul className='ql-font flex gap-x-1 justify-center relative'>
            <li className='size-5 cursor-pointer'>
              <Image onClick={QEditor_formats_list_toggle} data-active='false' src={"/images/editor/header.svg"} alt={"header"} width={50} height={50} />
              <ul className='absolute left-0 bottom-0 w-full bg-slate-100 shadow rounded border divide-y-2 opacity-0 transition-all duration-300 hidden'>
                <li onClick={QEditor_header} data-format='header' data-value='1' className='font-bold text-sm px-2 cursor-pointer hover:bg-blue-100'>
                  h1
                </li>
                <li onClick={QEditor_header} data-format='header' data-value='2' className='font-bold text-sm px-2 cursor-pointer hover:bg-blue-100'>
                  h2
                </li>
                <li onClick={QEditor_header} data-format='header' data-value='3' className='font-bold text-sm px-2 cursor-pointer hover:bg-blue-100'>
                  h3
                </li>
                <li onClick={QEditor_header} data-format='header' data-value='4' className='font-bold text-sm px-2 cursor-pointer hover:bg-blue-100'>
                  h4
                </li>
                <li onClick={QEditor_header} data-format='header' data-value='5' className='font-bold text-sm px-2 cursor-pointer hover:bg-blue-100'>
                  h5
                </li>
                <li onClick={QEditor_header} data-format='header' data-value='6' className='font-bold text-sm px-2 cursor-pointer hover:bg-blue-100'>
                  h6
                </li>
              </ul>
            </li>
            <li className='size-5 cursor-pointer'>
              <Image onClick={QEditor_formats_list_toggle} data-active='false' src={"/images/editor/font.svg"} alt={"font"} width={50} height={50} />
              <ul className='absolute left-0 bottom-0 w-full bg-slate-100 shadow rounded border divide-y-2 opacity-0 transition-all duration-300 hidden'>
                <li onClick={setFont} data-format='font' data-value='ibm_plex_sans' data-active='true' className=' ql-font-ibm_plex_sans px-2 cursor-pointer hover:bg-blue-100 bg-blue-100'>
                  default
                </li>
                <li onClick={setFont} data-format='font' data-value='fredoka_brando' data-active='false' className=' ql-font-fredoka_brando px-2 cursor-pointer hover:bg-blue-100'>
                  fredoka
                </li>
                <li onClick={setFont} data-format='font' data-value='ubuntu_mono' data-active='false' className=' ql-font-ubuntu_mono px-2 cursor-pointer hover:bg-blue-100'>
                  ubuntu
                </li>
                <li onClick={setFont} data-format='font' data-value='sofia' data-active='false' className=' ql-font-sofia px-2 cursor-pointer hover:bg-blue-100'>
                  sofia
                </li>
                <li onClick={setFont} data-format='font' data-value='Josefin_slab' data-active='false' className=' ql-font-Josefin_slab px-2 cursor-pointer hover:bg-blue-100'>
                  Josefin
                </li>
              </ul>
            </li>
            <li className='size-5 cursor-pointer'>
              <Image onClick={QEditor_formats_list_toggle} data-active='false' src={"/images/editor/size.svg"} alt={"size"} width={50} height={50} />
              <ul className='absolute left-0 bottom-0 w-full bg-slate-100 shadow rounded border divide-y-2 opacity-0 transition-all duration-300 hidden'>
                <li onClick={QEditor_size} data-format='size' data-value='huge' data-active='false' className='px-2 cursor-pointer hover:bg-blue-100'>
                  large
                </li>
                <li onClick={QEditor_size} data-format='size' data-value='large' data-active='false' className='px-2 cursor-pointer hover:bg-blue-100'>
                  medium
                </li>
                <li onClick={QEditor_size} data-format='size' className='px-2 cursor-pointer hover:bg-blue-100 bg-blue-100'>
                  normal
                </li>
                <li onClick={QEditor_size} data-format='size' data-value='small' data-active='false' className='px-2 cursor-pointer hover:bg-blue-100'>
                  small
                </li>
              </ul>
            </li>
          </ul>
          <ul className='ql-inline flex gap-x1 border-l-slate-300 border-l-2 pl-2'>
            <li onClick={QEditor_format} data-active='false' data-format='bold' className='ql-bold size-5 cursor-pointer'>
              <Image src={"/images/editor/bold.svg"} alt={"bold"} width={50} height={50} />
            </li>
            <li onClick={QEditor_format} data-active='false' data-format='italic' className='ql-italic size-5 cursor-pointer'>
              <Image src={"/images/editor/italic.svg"} alt={"italic"} width={50} height={50} />
            </li>
            <li onClick={QEditor_format} data-active='false' data-format='underline' className='ql-underline size-5 cursor-pointer'>
              <Image src={"/images/editor/underline.svg"} alt={"underline"} width={50} height={50} />
            </li>
            <li onClick={QEditor_format} data-active='false' data-format='strike' className='ql-strike size-5 cursor-pointer'>
              <Image src={"/images/editor/strike.svg"} alt={"strike"} width={50} height={50} />
            </li>
          </ul>
          <ul className='ql-space flex gap-x1 border-l-slate-300 border-l-2 pl-2'>
            <li onClick={QEditor_dir} data-active='false' data-format='ltr' className='ql-direction size-5 cursor-pointer'>
              <Image src={"/images/editor/direction.svg"} alt={"direction"} width={50} height={50} />
            </li>
            <li onClick={QEditor_format} data-format='indent' data-value='+1' className='ql-indent size-5 cursor-pointer'>
              <Image src={"/images/editor/indent+1.svg"} alt={"indent"} width={50} height={50} />
            </li>
            <li onClick={QEditor_format} data-format='indent' data-value='-1' className='ql-indent size-5 cursor-pointer'>
              <Image src={"/images/editor/indent-1.svg"} alt={"indent"} width={50} height={50} />
            </li>
            <li data-format='align' className='ql-align size-5 cursor-pointer relative'>
              <Image onClick={QEditor_formats_list_toggle} data-active='false' src={"/images/editor/align.svg"} alt={"align"} width={50} height={50} />
              <ul className='absolute -left-1/2 bottom-0 w-fit  bg-slate-100 shadow rounded border divide-y-2 opacity-0 transition-all duration-300 hidden'>
                <li onClick={QEditor_align} data-format='align' data-active='true' className='px-2 cursor-pointer hover:bg-blue-100 bg-blue-100'>
                  left
                </li>
                <li onClick={QEditor_align} data-format='align' data-value='center' data-active='false' className='px-2 cursor-pointer hover:bg-blue-100'>
                  center
                </li>
                <li onClick={QEditor_align} data-format='align' data-value='right' data-active='false' className='px-2 cursor-pointer hover:bg-blue-100'>
                  right
                </li>
              </ul>
            </li>
          </ul>
          <ul className='ql-block flex gap-x1 border-l-slate-300 border-l-2 pl-2'>
            <li onClick={list_handler} data-format='list' data-active='false' data-value='bullet' className='ql-list size-5 cursor-pointer'>
              <Image src={"/images/editor/ul.svg"} alt={"list"} width={50} height={50} />
            </li>
            <li onClick={list_handler} data-format='list' data-active='false' data-value='ordered' className='ql-list size-5 cursor-pointer'>
              <Image src={"/images/editor/ol.svg"} alt={"list"} width={50} height={50} />
            </li>
            <li className='size-5 cursor-pointer'>
              <input onInput={insertImageHandler} type='file' id='insertImage' hidden />
              <label htmlFor='insertImage' className='cursor-pointer'>
                <Image src={"/images/editor/image.svg"} alt={"image"} width={50} height={50} />
              </label>
            </li>
            <li onClick={link_handler} data-format='link' className='ql-link size-5 cursor-pointer'>
              <Image src={"/images/editor/link.svg"} alt={"link"} width={50} height={50} />
            </li>
          </ul>
          <ul className='ql-style flex gap-x1 border-l-slate-300 border-l-2 pl-2 relative'>
            <li className='ql-color size-5'>
              <input onBlur={colors_handler} data-format='color' type='color' id='color' className='w-0 h-0 left-0 bottom-full absolute' />
              <label htmlFor='color' className='cursor-pointer'>
                <Image src={"/images/editor/color.svg"} alt={"color"} width={50} height={50} />
              </label>
            </li>
            <li className='ql-color-bg size-5 flex'>
              <input onBlur={colors_handler} data-format='background' type='color' id='color-bg' className='w-0 h-0 left-0 bottom-full absolute' />
              <label htmlFor='color-bg' className='cursor-pointer'>
                <Image src={"/images/editor/color-bg.svg"} alt={"color-bg"} width={50} height={50} />
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div ref={resizeOptions} className='imageResizer absolute right-0 bottom-0 bg-slate-100 shadow-md rounded p-2 hidden'>
        <div className='close flex justify-end mb-2'>
          <i onClick={closeResizeOptions} className='bx bx-x bx-border cursor-pointer'></i>
        </div>
        <div className='image_with '>
          <div className='image_width'>
            <span>with:</span>
            <span>50%</span>
          </div>
          <input onInput={setImageWidth} type='range' min='1' max='100' className='transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200' />
        </div>
        <div className='imagePosition'>
          <span>position: </span>
          <select onChange={setImagePosition}>
            <option value='right' defaultValue='true'>
              left
            </option>
            <option value='center'>center</option>
            <option value='left'>right</option>
          </select>
        </div>
      </div>
    </div>
  );
}
