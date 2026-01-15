import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react-native";
import { useAuth } from "../contexts/AuthContext";
import { useBooks } from "../contexts/BookContext";
import BookCard from "../components/BookCard";
import Input from "../components/Input";
import Button from "../components/Button";
import {
  colors,
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../theme/colors";

const AdminScreen = () => {
  const navigation = useNavigation();
  const { isAdmin } = useAuth();
  const { books, categories, addBook, updateBook, deleteBook } = useBooks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (!isAdmin) {
      navigation.navigate("Home");
    }
  }, [isAdmin]);

  useEffect(() => {
    if (editingBook) {
      setValue("title", editingBook.title);
      setValue("author", editingBook.author);
      setValue("publisher", editingBook.publisher);
      setValue("price", String(editingBook.price));
      setValue("category", editingBook.category);
      setValue("description", editingBook.description);
      setValue("isbn", editingBook.isbn);
      setValue("publishDate", editingBook.publishDate);
      setValue("stock", String(editingBook.stock));
      setValue("image", editingBook.image);
    } else {
      reset();
    }
  }, [editingBook]);

  const onSubmit = (data) => {
    const bookData = {
      ...data,
      price: parseInt(data.price),
      stock: parseInt(data.stock),
    };

    if (editingBook) {
      updateBook(editingBook.id, bookData);
      Alert.alert("알림", "도서 정보가 수정되었습니다.");
    } else {
      addBook(bookData);
      Alert.alert("알림", "새 도서가 등록되었습니다.");
    }

    setIsModalOpen(false);
    setEditingBook(null);
    reset();
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Alert.alert("삭제 확인", "정말 삭제하시겠습니까?", [
      { text: "취소" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          deleteBook(id);
          Alert.alert("알림", "도서가 삭제되었습니다.");
        },
      },
    ]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    reset();
  };

  if (!isAdmin) {
    return null;
  }

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItemContainer}>
      <BookCard book={item} />
      <View style={styles.bookActions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={[styles.actionButton, styles.editButton]}
        >
          <Edit2 size={16} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Trash2 size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const availableCategories = categories.filter((c) => c !== "전체");

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>관리자 페이지</Text>
        <TouchableOpacity
          onPress={() => {
            setEditingBook(null);
            setIsModalOpen(true);
          }}
          style={styles.addButton}
        >
          <Plus size={20} color={colors.white} />
          <Text style={styles.addButtonText}>새 도서 등록</Text>
        </TouchableOpacity>
      </View>

      {/* 도서 목록 */}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookItem}
        numColumns={2}
        contentContainerStyle={styles.bookList}
        showsVerticalScrollIndicator={false}
      />

      {/* 모달 */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingBook ? "도서 정보 수정" : "새 도서 등록"}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Controller
              control={control}
              name="title"
              rules={{ required: "도서명을 입력해주세요." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="도서명"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="author"
              rules={{ required: "저자를 입력해주세요." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="저자"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.author?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="publisher"
              rules={{ required: "출판사를 입력해주세요." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="출판사"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.publisher?.message}
                />
              )}
            />

            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Controller
                  control={control}
                  name="price"
                  rules={{ required: "가격을 입력해주세요." }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="가격"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.price?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.formHalf}>
                <Controller
                  control={control}
                  name="stock"
                  rules={{ required: "재고를 입력해주세요." }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="재고"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.stock?.message}
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="category"
              rules={{ required: "카테고리를 선택해주세요." }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryLabel}>카테고리</Text>
                  <View style={styles.categoryButtons}>
                    {availableCategories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => onChange(cat)}
                        style={[
                          styles.categoryButton,
                          value === cat && styles.categoryButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            value === cat && styles.categoryButtonTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.category && (
                    <Text style={styles.errorText}>
                      {errors.category.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Controller
                  control={control}
                  name="isbn"
                  rules={{ required: "ISBN을 입력해주세요." }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="ISBN"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.isbn?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.formHalf}>
                <Controller
                  control={control}
                  name="publishDate"
                  rules={{ required: "출간일을 입력해주세요." }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="출간일"
                      placeholder="YYYY-MM-DD"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.publishDate?.message}
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="image"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="이미지 URL"
                  placeholder="https://..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              rules={{ required: "설명을 입력해주세요." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.textareaContainer}>
                  <Text style={styles.textareaLabel}>설명</Text>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={styles.textarea}
                  />
                  {errors.description && (
                    <Text style={styles.errorText}>
                      {errors.description.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <View style={styles.modalButtons}>
              <Button
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
              >
                {editingBook ? "수정" : "등록"}
              </Button>
              <Button
                variant="secondary"
                onPress={closeModal}
                style={styles.cancelButton}
              >
                취소
              </Button>
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  addButtonText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  bookList: {
    padding: spacing.lg,
  },
  bookItemContainer: {
    flex: 1,
    maxWidth: "50%",
    paddingHorizontal: spacing.xs,
    position: "relative",
  },
  bookActions: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.md,
    flexDirection: "row",
    gap: spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editButton: {
    backgroundColor: colors.primary[600],
  },
  deleteButton: {
    backgroundColor: colors.red[600],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  formRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  formHalf: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: spacing.md,
  },
  categoryLabel: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  categoryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[200],
  },
  categoryButtonActive: {
    backgroundColor: colors.primary[600],
  },
  categoryButtonText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  textareaContainer: {
    marginBottom: spacing.md,
  },
  textareaLabel: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.base,
    minHeight: 100,
    backgroundColor: colors.white,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.red[600],
  },
  modalButtons: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  submitButton: {
    width: "100%",
  },
  cancelButton: {
    width: "100%",
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default AdminScreen;
